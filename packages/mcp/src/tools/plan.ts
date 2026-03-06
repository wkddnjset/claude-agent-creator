import { generatePlanQuestions } from '../utils/questions.js';
import { savePlan, type PlanData } from '../utils/state.js';

export interface PlanInput {
  request: string;
  answers?: Record<string, string>;
}

export function handlePlan(input: PlanInput): object {
  if (!input.answers) {
    const questions = generatePlanQuestions(input.request);
    return {
      stage: 'questions',
      message: '에이전트를 만들기 위해 몇 가지 질문에 답해주세요.',
      questions,
      nextStep: '답변을 작성한 후 anygent_plan을 다시 호출하세요. request에 같은 내용, answers에 답변을 넣어주세요.',
      answersFormat: {
        purpose: '에이전트의 주요 목적',
        targetUser: '사용 대상',
        trigger: '동작 조건',
        tools: '필요한 도구/API',
        outputFormat: '결과물 형태',
        tone: 'formal|casual|professional',
        doNotList: '금지사항 (쉼표 구분)',
      },
    };
  }

  const answers = input.answers;

  const plan: PlanData = {
    agentName: deriveAgentName(input.request),
    agentNameKr: deriveAgentNameKr(input.request),
    purpose: answers.purpose || input.request,
    targetUser: answers.targetUser || '일반 사용자',
    coreCapabilities: extractList(answers.purpose || input.request),
    requiredTools: extractList(answers.tools || '없음'),
    triggerConditions: answers.trigger || '사용자 요청 시',
    outputFormat: answers.outputFormat || '마크다운 텍스트',
    tone: parseTone(answers.tone),
    language: parseLanguage(answers.language),
    doNotList: extractList(answers.doNotList || '없음'),
    successCriteria: generateSuccessCriteria(answers),
    estimatedComplexity: estimateComplexity(answers),
  };

  savePlan(plan);

  return {
    stage: 'completed',
    message: 'Plan이 생성되었습니다! `.anygent/plan.json`에 저장되었습니다.',
    plan,
    nextStep: '다음 단계: anygent_research를 실행하세요.',
  };
}

function deriveAgentName(request: string): string {
  const words = request
    .replace(/[^a-zA-Z가-힣0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);
  if (words.length === 0) return 'custom-agent';
  return words
    .map((w) => w.toLowerCase())
    .join('-')
    .replace(/[가-힣]+/g, 'agent');
}

function deriveAgentNameKr(request: string): string {
  const cleaned = request.replace(/[^\w가-힣\s]/g, '').trim();
  if (cleaned.length > 20) return cleaned.slice(0, 20) + ' 에이전트';
  return cleaned + ' 에이전트';
}

function extractList(text: string): string[] {
  if (text === '없음' || !text.trim()) return ['없음'];
  return text
    .split(/[,、，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseTone(tone?: string): 'formal' | 'casual' | 'professional' {
  if (tone === 'formal' || tone === 'casual' || tone === 'professional') return tone;
  return 'professional';
}

function parseLanguage(lang?: string): 'ko' | 'en' | 'bilingual' {
  if (lang === 'ko' || lang === 'en' || lang === 'bilingual') return lang;
  return 'ko';
}

function generateSuccessCriteria(answers: Record<string, string>): string[] {
  const criteria: string[] = [];
  if (answers.purpose) criteria.push(`핵심 목적 달성: ${answers.purpose}`);
  if (answers.outputFormat) criteria.push(`올바른 출력 형식: ${answers.outputFormat}`);
  criteria.push('사용자 요청에 정확하게 응답');
  criteria.push('금지사항 준수');
  return criteria;
}

function estimateComplexity(answers: Record<string, string>): 'simple' | 'medium' | 'complex' {
  const tools = answers.tools || '';
  if (tools === '없음' || !tools.trim()) return 'simple';
  const toolCount = tools.split(/[,、，]/).length;
  if (toolCount >= 3) return 'complex';
  return 'medium';
}
