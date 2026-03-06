import { loadPlan, saveResearch } from '../utils/state.js';

export function handleResearch(): object {
  const plan = loadPlan();
  if (!plan) {
    return {
      error: true,
      message: 'plan.json이 없습니다. 먼저 anygent_plan을 실행해주세요.',
    };
  }

  const toolAnalysis = plan.requiredTools
    .filter((t) => t !== '없음')
    .map((tool) => `- **${tool}**: 구현 필요`)
    .join('\n') || '- 별도 외부 도구 불필요';

  const fileStructure = generateFileStructure(plan);

  const researchMd = `# ${plan.agentNameKr} - Research 문서

## 에이전트 개요
- **이름**: ${plan.agentNameKr} (${plan.agentName})
- **목적**: ${plan.purpose}
- **대상 사용자**: ${plan.targetUser}
- **복잡도**: ${plan.estimatedComplexity}

## 핵심 프롬프트 전략

### 시스템 프롬프트 초안
\`\`\`
당신은 ${plan.agentNameKr}입니다.

역할: ${plan.purpose}

핵심 원칙:
${plan.coreCapabilities.map((c) => `- ${c}`).join('\n')}

톤: ${plan.tone === 'formal' ? '격식체' : plan.tone === 'casual' ? '친근한 말투' : '전문적 톤'}

금지사항:
${plan.doNotList.map((d) => `- ${d}`).join('\n')}
\`\`\`

## 필요 도구 및 스크립트 목록
${toolAnalysis}

## 구현 상세 계획
1. CLAUDE.md 생성 - 에이전트 시스템 프롬프트 및 동작 지침
2. README.md 생성 - 비개발자를 위한 사용 가이드
${plan.requiredTools.some((t) => t !== '없음') ? '3. scripts/ 폴더 생성 - 필요한 스크립트 파일\n4. install.sh 생성 - 설치 스크립트' : ''}

## 예상 파일 구조
${fileStructure}

## 주의사항 및 제약
${plan.doNotList.map((d) => `- ${d}`).join('\n')}
- 에이전트는 주어진 범위 내에서만 동작해야 합니다
- 사용자 데이터 보호에 유의해야 합니다
`;

  saveResearch(researchMd);

  return {
    message: 'Research가 완료되었습니다! `.anygent/research.md`에 저장되었습니다.',
    summary: {
      agentName: plan.agentNameKr,
      complexity: plan.estimatedComplexity,
      toolsNeeded: plan.requiredTools,
      filesPlanned: fileStructure,
    },
    nextStep: '다음 단계: anygent_do를 실행하세요.',
  };
}

function generateFileStructure(plan: NonNullable<ReturnType<typeof loadPlan>>): string {
  const lines = [
    '```',
    `${plan.agentName}/`,
    '├── CLAUDE.md          # 에이전트 시스템 프롬프트',
    '├── README.md          # 사용 가이드',
  ];

  if (plan.requiredTools.some((t: string) => t !== '없음')) {
    lines.push('├── scripts/');
    lines.push('│   └── install.sh     # 설치 스크립트');
  }

  lines.push('```');
  return lines.join('\n');
}
