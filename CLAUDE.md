# Anygent MCP - 고도화 지시사항

## 작업 목표
기존 MCP 서버를 4단계 프로세스(plan → research → do → check)로 전면 개편

## 핵심 설계 원칙
1. 비개발자가 서브에이전트 만드는 방법 몰라도 됨
2. 각 단계에서 역질문으로 누락 방지
3. 에이전트 동작에 필요한 스크립트까지 자동 생성
4. plan → research → do → check 순서 강제 (이전 단계 없이 다음 단계 진행 불가)

## 사용 방식
Claude Code에서 slash command처럼:
- `/anygent plan <내용>` → plan 도구 실행
- `/anygent research` → research 도구 실행
- `/anygent do` → do 도구 실행
- `/anygent check` → check 도구 실행

실제로는 MCP 도구명: `anygent_plan`, `anygent_research`, `anygent_do`, `anygent_check`

## 상태 관리
각 단계 결과를 `.anygent/` 폴더에 저장:
- `.anygent/plan.json` - plan 단계 결과
- `.anygent/research.md` - research 단계 결과
- `.anygent/do-result.json` - do 단계 생성 파일 목록
- `.anygent/check-report.md` - check 단계 검수 결과

## 각 도구 상세 스펙

### 1. `anygent_plan`
**입력**: `{ request: string, answers?: Record<string, string> }`

**동작 흐름**:
1. 첫 호출 (answers 없음): 요청 분석 후 역질문 5-7개 생성
   - 에이전트의 주요 목적/역할
   - 사용 빈도 및 트리거 조건
   - 필요한 외부 도구/API 여부
   - 결과물 형태 (파일저장/메시지/자동실행 등)
   - 에이전트 말투/톤 선호도
   - 특별히 하면 안 되는 것
   - 성공 기준
2. 두 번째 호출 (answers 있음): 답변 바탕으로 plan.json 생성 + 저장

**plan.json 구조**:
```json
{
  "agentName": "string",
  "agentNameKr": "string",
  "purpose": "string",
  "targetUser": "string",
  "coreCapabilities": ["string"],
  "requiredTools": ["string"],  // api, script, mcp tool 등
  "triggerConditions": "string",
  "outputFormat": "string",
  "tone": "formal|casual|professional",
  "language": "ko|en|bilingual",
  "doNotList": ["string"],
  "successCriteria": ["string"],
  "estimatedComplexity": "simple|medium|complex"
}
```

**반환**: 질문 목록(첫 호출) 또는 plan 확인 요약(두 번째 호출)

---

### 2. `anygent_research`
**입력**: `{}` (plan.json 자동 로드)
**사전 조건**: .anygent/plan.json 존재해야 함

**동작**:
1. plan.json 로드
2. requiredTools 기반으로 구현 방향 분석
3. research.md 생성 (아래 섹션 포함):
   - ## 에이전트 개요
   - ## 핵심 프롬프트 전략 (시스템 프롬프트 초안 포함)
   - ## 필요 도구 및 스크립트 목록
   - ## 구현 상세 계획
   - ## 예상 파일 구조
   - ## 주의사항 및 제약

**반환**: research.md 요약 + 다음 단계 안내

---

### 3. `anygent_do`
**입력**: `{ outputDir?: string }` (기본값: ./agent-output)
**사전 조건**: .anygent/plan.json, .anygent/research.md 존재해야 함

**생성 파일들**:
1. `CLAUDE.md` - 서브에이전트 메인 설정파일 (시스템 프롬프트)
2. `README.md` - 에이전트 사용 가이드 (비개발자 친화적)
3. `scripts/` - 필요한 경우만 (plan의 requiredTools 기반)
   - API 호출 스크립트 (python/shell)
   - 자동화 스크립트
   - 설치 스크립트 (install.sh)
4. `.anygent/do-result.json` - 생성된 파일 목록 + 메타데이터

**CLAUDE.md 구조** (반드시 이 형식으로):
```markdown
# [에이전트 이름]

## 역할
[에이전트가 하는 일 1-2줄]

## 핵심 원칙
- [원칙 1]
- [원칙 2]
...

## 동작 방식
[구체적인 행동 지침]

## 하지 말아야 할 것
- [금지사항 1]
...

## 응답 형식
[출력 형태 명세]
```

**반환**: 생성된 파일 목록 + 각 파일 설명

---

### 4. `anygent_check`
**입력**: `{}` (do-result.json 자동 로드)
**사전 조건**: .anygent/do-result.json 존재해야 함

**동작**:
1. plan.json의 successCriteria 로드
2. CLAUDE.md 로드
3. 샘플 시나리오 3개 자동 생성 (use case 기반)
4. 각 시나리오에 대해 에이전트가 어떻게 응답할지 시뮬레이션
5. check-report.md 생성:
   ```markdown
   # 검수 보고서
   
   ## 시나리오 1: [제목]
   **입력**: ...
   **예상 출력**: ...
   **평가**: ✅ 통과 / ⚠️ 부분 통과 / ❌ 실패
   **이유**: ...
   
   ## 시나리오 2: ...
   ## 시나리오 3: ...
   
   ## 종합 평가
   - 통과율: X/3
   - 개선 필요 항목: ...
   - 권장 사항: ...
   ```

**반환**: 검수 결과 요약

---

## 기존 도구 처리
기존 6개 도구(interview_workflow 등)는 삭제하고 새 4개 도구로 교체

## 파일 구조 (최종)
```
packages/mcp/
├── src/
│   ├── index.ts              # 4개 도구 등록
│   ├── tools/
│   │   ├── plan.ts           # anygent_plan
│   │   ├── research.ts       # anygent_research
│   │   ├── do.ts             # anygent_do
│   │   └── check.ts          # anygent_check
│   ├── templates/            # 기존 유지 (do 단계에서 활용)
│   │   └── ...
│   └── utils/
│       ├── state.ts          # .anygent/ 폴더 상태 관리
│       ├── fileGenerator.ts  # 파일 생성 유틸
│       └── questions.ts      # 역질문 생성 로직
├── package.json
└── tsconfig.json
```

## 완료 후 할 일
1. `npm run build` 실행해서 빌드 성공 확인
2. git add -A && git commit -m "feat: 4-stage process (plan/research/do/check)" && git push
3. 완료 후 반드시 실행:
   openclaw system event --text "Anygent 4단계 프로세스 구현 완료! plan/research/do/check 모두 구현됨. GitHub 푸시까지 완료." --mode now
