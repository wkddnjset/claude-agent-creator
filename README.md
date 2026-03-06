# Anygent MCP

**비개발자도 나만의 Claude 에이전트를 만들 수 있는 MCP 서버**

A Model Context Protocol (MCP) server that helps non-developers build custom Claude sub-agents for their workflows.

---

## What is this? / 이게 뭔가요?

Anygent MCP는 코딩 없이 자신만의 Claude 에이전트를 만들 수 있는 도구입니다.
간단한 인터뷰 과정을 통해 나의 업무에 맞는 CLAUDE.md 설정 파일을 자동으로 생성합니다.

Anygent MCP is a tool that lets you create your own Claude agent without coding.
Through a simple interview process, it automatically generates a CLAUDE.md configuration file tailored to your workflow.

---

## Installation / 설치

```bash
# npm으로 설치
npm install anygent-mcp

# 또는 직접 실행
npx anygent-mcp
```

### Claude Code에서 사용하기

`~/.claude/settings.json`에 추가:

```json
{
  "mcpServers": {
    "anygent": {
      "command": "npx",
      "args": ["anygent-mcp"]
    }
  }
}
```

---

## Quick Start / 빠른 시작

### 방법 1: 인터뷰로 만들기

1. Claude Code에서 `interview_workflow` 도구를 호출합니다
2. 질문에 답변합니다 (역할, 업무, 목표 등)
3. `generate_claude_md`로 설정 파일을 생성합니다
4. `save_config`로 저장합니다

<!-- Screenshot: Interview flow -->

### 방법 2: 템플릿으로 만들기

1. `list_templates`로 사용 가능한 템플릿을 확인합니다
2. `apply_template`로 원하는 템플릿을 적용합니다
3. 필요시 회사명, 산업 등을 커스터마이징합니다
4. `save_config`로 저장합니다

<!-- Screenshot: Template flow -->

---

## Available Templates / 사용 가능한 템플릿

| ID | 이름 | 설명 | 태그 |
|---|---|---|---|
| `marketer` | 디지털 마케터 | SNS 콘텐츠, 광고 카피, 트렌드 분석 | 마케팅, SNS, 광고 |
| `content-creator` | 콘텐츠 크리에이터 | 스크립트 작성, 썸네일 아이디어, 댓글 답변 | 유튜브, 크리에이터 |
| `pm` | 프로덕트 매니저 | PRD 작성, 스프린트 계획, 회의록 | PM, 기획, PRD |
| `researcher` | 리서처 | 자료 조사, 요약, 인사이트 도출 | 리서치, 분석 |
| `sales` | 영업 담당자 | 제안서, 이메일, 고객 관리 | 영업, 제안서 |
| `support` | 고객 지원 | FAQ, 답변 초안, 케이스 분류 | CS, FAQ |

---

## MCP Tools / MCP 도구

| 도구 | 설명 |
|---|---|
| `interview_workflow` | 워크플로우 인터뷰를 시작합니다 |
| `generate_claude_md` | 인터뷰 답변으로 CLAUDE.md를 생성합니다 |
| `list_templates` | 사용 가능한 템플릿 목록을 보여줍니다 |
| `apply_template` | 선택한 템플릿을 적용합니다 |
| `preview_config` | 생성된 설정을 미리봅니다 |
| `save_config` | CLAUDE.md를 파일로 저장합니다 |

---

## Development / 개발

```bash
# 의존성 설치
cd packages/mcp
npm install

# 개발 모드
npm run dev

# 빌드
npm run build

# 실행
npm start
```

---

## Contributing / 기여하기

1. 이 저장소를 Fork합니다
2. 새 브랜치를 만듭니다 (`git checkout -b feature/my-template`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add new template'`)
4. 브랜치에 Push합니다 (`git push origin feature/my-template`)
5. Pull Request를 생성합니다

### 새 템플릿 추가하기

`packages/mcp/src/templates/` 디렉토리에 새 TypeScript 파일을 추가하세요.
`WorkflowTemplate` 인터페이스를 따르면 됩니다. 그 후 `index.ts`에 등록해주세요.

---

## License

MIT
