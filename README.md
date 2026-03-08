# Anygent — 나만의 Claude 에이전트 만들기

[![Claude Code](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://code.claude.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1.0-green.svg)](.claude-plugin/plugin.json)

> **코딩 없이 나만의 Claude 에이전트를 만드세요.**
> 4단계 인터뷰 또는 직무별 템플릿으로 맞춤형 CLAUDE.md를 자동 생성합니다.

---

## 설치

```bash
# Step 1: Anygent 마켓플레이스 등록
/plugin marketplace add wkddnjset/claude-agent-creator

# Step 2: 플러그인 설치
/plugin install anygent
```

---

## 사용법

### 🎯 인터뷰로 만들기 (추천)

```bash
/anygent
```

Plan → Research → Do → Check 4단계로 나만의 에이전트를 만들어드립니다.

### 📋 템플릿 목록 보기

```bash
/anygent-list
```

### ⚡ 템플릿으로 바로 설치

```bash
/anygent-install marketer        # 디지털 마케터
/anygent-install pm              # 프로덕트 매니저
/anygent-install content-creator # 콘텐츠 크리에이터
/anygent-install researcher      # 리서처
/anygent-install sales           # 영업 담당자
/anygent-install support         # 고객 지원
```

---

## 제공 템플릿

| 템플릿 | 역할 | 주요 기능 |
|--------|------|-----------|
| `marketer` | 디지털 마케터 | SNS 콘텐츠, 광고 카피, 트렌드 분석 |
| `pm` | 프로덕트 매니저 | PRD 작성, 스프린트 계획, 회의록 |
| `content-creator` | 콘텐츠 크리에이터 | 스크립트, 썸네일 아이디어, 댓글 관리 |
| `researcher` | 리서처 | 자료 조사, 요약, 인사이트 도출 |
| `sales` | 영업 담당자 | 제안서, 고객 이메일, 협상 전략 |
| `support` | 고객 지원 | FAQ, 답변 초안, 케이스 분류 |

---

## 플러그인 구조

```
claude-agent-creator/
├── .claude-plugin/
│   ├── plugin.json          # Claude Code 플러그인 매니페스트
│   └── marketplace.json     # 마켓플레이스 레지스트리
├── skills/
│   ├── anygent/             # /anygent — 인터뷰로 에이전트 생성
│   │   └── SKILL.md
│   ├── anygent-list/        # /anygent-list — 템플릿 목록
│   │   └── SKILL.md
│   └── anygent-install/     # /anygent-install — 템플릿 설치
│       └── SKILL.md
├── templates/               # 직무별 CLAUDE.md 템플릿
│   ├── marketer.md
│   ├── pm.md
│   ├── content-creator.md
│   ├── researcher.md
│   ├── sales.md
│   └── support.md
└── web/                     # 랜딩페이지 (anygent.ngrok.app)
```

---

## 랜딩페이지

👉 [anygent.ngrok.app](https://anygent.ngrok.app)

---

## License

MIT
