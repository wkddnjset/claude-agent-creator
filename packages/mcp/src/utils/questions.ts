export interface PlanQuestion {
  id: string;
  question: string;
  hint: string;
}

export function generatePlanQuestions(request: string): PlanQuestion[] {
  return [
    {
      id: 'purpose',
      question: '이 에이전트의 주요 목적과 역할은 무엇인가요?',
      hint: `요청 내용: "${request}" - 좀 더 구체적으로 어떤 일을 하는 에이전트인지 설명해주세요.`,
    },
    {
      id: 'targetUser',
      question: '이 에이전트를 주로 사용할 대상은 누구인가요?',
      hint: '예: 마케팅팀, 개발자, 고객지원 담당자, 일반 사용자 등',
    },
    {
      id: 'trigger',
      question: '에이전트가 언제/어떤 상황에서 동작해야 하나요?',
      hint: '예: 매일 아침, 특정 명령어 입력 시, 파일이 업로드될 때 등',
    },
    {
      id: 'tools',
      question: '에이전트가 사용해야 할 외부 도구나 API가 있나요?',
      hint: '예: 웹 검색, 파일 읽기/쓰기, Slack 알림, 데이터베이스 조회 등. 없으면 "없음"',
    },
    {
      id: 'outputFormat',
      question: '에이전트의 결과물 형태는 어떤 것을 원하나요?',
      hint: '예: 마크다운 파일, JSON 데이터, 터미널 출력, 자동 실행 등',
    },
    {
      id: 'tone',
      question: '에이전트의 말투/톤은 어떤 것을 선호하나요?',
      hint: 'formal(격식체), casual(친근한), professional(전문적) 중 선택',
    },
    {
      id: 'doNotList',
      question: '에이전트가 절대 하면 안 되는 것이 있나요?',
      hint: '예: 개인정보 수집 금지, 외부 API 호출 금지, 파일 삭제 금지 등. 없으면 "없음"',
    },
  ];
}
