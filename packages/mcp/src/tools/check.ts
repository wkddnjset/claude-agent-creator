import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPlan, loadDoResult, saveCheckReport } from '../utils/state.js';

interface Scenario {
  title: string;
  input: string;
  expectedOutput: string;
  evaluation: 'pass' | 'partial' | 'fail';
  reason: string;
}

export function handleCheck(): object {
  const plan = loadPlan();
  if (!plan) {
    return { error: true, message: 'plan.json이 없습니다. 먼저 anygent_plan을 실행해주세요.' };
  }

  const doResult = loadDoResult();
  if (!doResult) {
    return { error: true, message: 'do-result.json이 없습니다. 먼저 anygent_do를 실행해주세요.' };
  }

  // CLAUDE.md 로드
  let claudeMdContent = '';
  try {
    claudeMdContent = readFileSync(resolve(doResult.outputDir, 'CLAUDE.md'), 'utf-8');
  } catch {
    return { error: true, message: 'CLAUDE.md 파일을 찾을 수 없습니다. anygent_do를 다시 실행해주세요.' };
  }

  // 시나리오 생성
  const scenarios = generateScenarios(plan, claudeMdContent);

  // 검수 보고서 생성
  const passCount = scenarios.filter((s) => s.evaluation === 'pass').length;
  const partialCount = scenarios.filter((s) => s.evaluation === 'partial').length;

  const improvements: string[] = [];
  for (const s of scenarios) {
    if (s.evaluation !== 'pass') {
      improvements.push(`${s.title}: ${s.reason}`);
    }
  }

  const evalIcon = (e: string) => e === 'pass' ? 'PASS' : e === 'partial' ? 'PARTIAL' : 'FAIL';

  const report = `# 검수 보고서

${scenarios.map((s, i) => `## 시나리오 ${i + 1}: ${s.title}
**입력**: ${s.input}
**예상 출력**: ${s.expectedOutput}
**평가**: ${evalIcon(s.evaluation)}
**이유**: ${s.reason}
`).join('\n')}

## 종합 평가
- 통과율: ${passCount}/${scenarios.length}
- 부분 통과: ${partialCount}/${scenarios.length}
${improvements.length > 0 ? `- 개선 필요 항목:\n${improvements.map((i) => `  - ${i}`).join('\n')}` : '- 모든 시나리오 통과!'}
- 권장 사항: ${passCount === scenarios.length ? '에이전트가 준비되었습니다. 바로 사용 가능합니다.' : '일부 시나리오에서 개선이 필요합니다. CLAUDE.md를 수정한 후 다시 check해주세요.'}
`;

  saveCheckReport(report);

  return {
    message: '검수가 완료되었습니다! `.anygent/check-report.md`에 저장되었습니다.',
    summary: {
      passRate: `${passCount}/${scenarios.length}`,
      scenarios: scenarios.map((s) => ({
        title: s.title,
        evaluation: evalIcon(s.evaluation),
      })),
      recommendation: passCount === scenarios.length
        ? '에이전트가 준비되었습니다!'
        : '일부 개선이 필요합니다.',
    },
  };
}

function generateScenarios(plan: ReturnType<typeof loadPlan>, claudeMdContent: string): Scenario[] {
  const scenarios: Scenario[] = [];

  // 시나리오 1: 기본 기능 테스트
  scenarios.push({
    title: '기본 기능 수행',
    input: `"${plan!.purpose}"에 해당하는 기본 요청`,
    expectedOutput: `${plan!.outputFormat} 형태의 응답`,
    evaluation: claudeMdContent.includes(plan!.purpose.slice(0, 10)) ? 'pass' : 'partial',
    reason: claudeMdContent.includes(plan!.purpose.slice(0, 10))
      ? 'CLAUDE.md에 목적이 명확히 정의되어 있습니다.'
      : 'CLAUDE.md에 목적 설명이 부족할 수 있습니다.',
  });

  // 시나리오 2: 금지사항 준수 테스트
  const hasDoNotList = plan!.doNotList.some((d) => d !== '없음');
  scenarios.push({
    title: '금지사항 준수',
    input: hasDoNotList
      ? `금지된 행동 요청: "${plan!.doNotList[0]}"`
      : '범위 밖 요청',
    expectedOutput: '거절 또는 안내 메시지',
    evaluation: claudeMdContent.includes('하지 말아야 할 것') ? 'pass' : 'fail',
    reason: claudeMdContent.includes('하지 말아야 할 것')
      ? '금지사항 섹션이 CLAUDE.md에 포함되어 있습니다.'
      : '금지사항 섹션이 누락되었습니다.',
  });

  // 시나리오 3: 톤/스타일 테스트
  const toneLabel = plan!.tone === 'formal' ? '격식체' : plan!.tone === 'casual' ? '친근한' : '전문적';
  scenarios.push({
    title: '톤/스타일 일관성',
    input: '일반적인 질문',
    expectedOutput: `${toneLabel} 톤으로 응답`,
    evaluation: claudeMdContent.toLowerCase().includes(plan!.tone) ||
      claudeMdContent.includes(toneLabel) ? 'pass' : 'partial',
    reason: claudeMdContent.includes(toneLabel)
      ? `${toneLabel} 톤 지시가 포함되어 있습니다.`
      : '톤 설정이 명시적이지 않을 수 있습니다.',
  });

  return scenarios;
}
