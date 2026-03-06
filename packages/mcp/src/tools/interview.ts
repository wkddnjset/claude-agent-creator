export interface WorkflowData {
  role: string;
  dailyTasks: string[];
  agentGoal: string;
  tonePreference: 'formal' | 'casual' | 'professional';
  language: 'ko' | 'en' | 'bilingual';
  additionalContext?: string;
}

interface InterviewStep {
  question: string;
  field: keyof WorkflowData;
  type: 'text' | 'list' | 'choice';
  options?: string[];
}

const interviewSteps: InterviewStep[] = [
  {
    question: '어떤 일을 하고 계신가요? (예: 마케터, 개발자, PM 등)',
    field: 'role',
    type: 'text',
  },
  {
    question: '매일 반복적으로 하는 업무를 알려주세요. (쉼표로 구분)',
    field: 'dailyTasks',
    type: 'list',
  },
  {
    question: '에이전트가 어떤 도움을 주면 좋을까요?',
    field: 'agentGoal',
    type: 'text',
  },
  {
    question: '원하는 말투를 선택해주세요.',
    field: 'tonePreference',
    type: 'choice',
    options: ['formal (격식체)', 'casual (친근한)', 'professional (전문적)'],
  },
  {
    question: '에이전트가 사용할 언어를 선택해주세요.',
    field: 'language',
    type: 'choice',
    options: ['ko (한국어)', 'en (영어)', 'bilingual (한국어+영어)'],
  },
];

export function getInterviewQuestions(): object {
  return {
    description: '워크플로우 인터뷰',
    instructions:
      '아래 질문에 답변해주세요. 답변을 모두 작성한 후 generate_claude_md 도구를 사용하여 에이전트 설정을 생성할 수 있습니다.',
    questions: interviewSteps.map((step, index) => ({
      step: index + 1,
      question: step.question,
      field: step.field,
      type: step.type,
      ...(step.options ? { options: step.options } : {}),
    })),
    example_response: {
      role: '디지털 마케터',
      dailyTasks: ['SNS 콘텐츠 작성', '광고 성과 분석', '보고서 작성'],
      agentGoal: '매일 SNS에 올릴 콘텐츠를 빠르게 만들고 싶어요',
      tonePreference: 'professional',
      language: 'ko',
    },
  };
}

export function validateWorkflowData(data: Record<string, unknown>): WorkflowData {
  const role = String(data.role || '');
  if (!role) throw new Error('역할(role)을 입력해주세요.');

  let dailyTasks: string[];
  if (Array.isArray(data.dailyTasks)) {
    dailyTasks = data.dailyTasks.map(String);
  } else if (typeof data.dailyTasks === 'string') {
    dailyTasks = data.dailyTasks.split(',').map((s: string) => s.trim()).filter(Boolean);
  } else {
    throw new Error('일상 업무(dailyTasks)를 입력해주세요.');
  }

  const agentGoal = String(data.agentGoal || '');
  if (!agentGoal) throw new Error('에이전트 목표(agentGoal)를 입력해주세요.');

  const validTones = ['formal', 'casual', 'professional'] as const;
  const tonePreference = validTones.includes(data.tonePreference as typeof validTones[number])
    ? (data.tonePreference as typeof validTones[number])
    : 'professional';

  const validLanguages = ['ko', 'en', 'bilingual'] as const;
  const language = validLanguages.includes(data.language as typeof validLanguages[number])
    ? (data.language as typeof validLanguages[number])
    : 'ko';

  return {
    role,
    dailyTasks,
    agentGoal,
    tonePreference,
    language,
    additionalContext: data.additionalContext ? String(data.additionalContext) : undefined,
  };
}
