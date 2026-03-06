import type { WorkflowData } from './interview.js';

const toneMap = {
  formal: '격식체로 작성합니다. 존댓말을 사용합니다.',
  casual: '친근하고 편안한 말투를 사용합니다. 이모지도 적절히 활용합니다.',
  professional: '전문적이고 간결한 톤을 사용합니다.',
};

const languageMap = {
  ko: '모든 응답은 한국어로 작성합니다.',
  en: 'All responses should be written in English.',
  bilingual: '한국어를 기본으로 사용하되, 필요시 영어를 병행합니다.',
};

export function generateClaudeMd(data: WorkflowData): string {
  const taskList = data.dailyTasks.map((t) => `- ${t}`).join('\n');

  const content = `# ${data.role} 전문 에이전트

## 역할
당신은 **${data.role}** 전문 어시스턴트입니다.
사용자의 업무를 효율적으로 도와주는 것이 목표입니다.

## 핵심 목표
${data.agentGoal}

## 주요 업무 영역
${taskList}

## 커뮤니케이션 스타일
- ${toneMap[data.tonePreference]}
- ${languageMap[data.language]}

## 작업 원칙
1. 사용자의 요청을 정확히 이해한 후 작업을 시작합니다
2. 결과물은 바로 사용할 수 있는 수준으로 제공합니다
3. 불확실한 부분은 가정하지 않고 확인합니다
4. 이전 대화 맥락을 기억하고 활용합니다

## 출력 형식
- 구조화된 형태로 결과를 제공합니다
- 긴 내용은 요약 → 상세 순서로 제공합니다
- 여러 옵션이 있을 때는 비교표를 활용합니다
${data.additionalContext ? `\n## 추가 컨텍스트\n${data.additionalContext}` : ''}
`;

  return content;
}

export function generateFromTemplate(
  systemPrompt: string,
  name: string,
  tone: string,
  language: string,
  customization?: Record<string, string>,
): string {
  let content = `# ${name} 에이전트

${systemPrompt}
`;

  if (customization) {
    if (customization.companyName) {
      content += `\n## 회사 정보\n회사명: ${customization.companyName}\n`;
    }
    if (customization.industry) {
      content += `산업: ${customization.industry}\n`;
    }
    if (customization.additionalInstructions) {
      content += `\n## 추가 지시사항\n${customization.additionalInstructions}\n`;
    }
  }

  return content;
}
