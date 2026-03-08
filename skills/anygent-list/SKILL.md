---
name: anygent-list
description: |
  사용 가능한 Claude 에이전트 템플릿 목록을 보여줍니다.
  바로 쓸 수 있는 직무별 템플릿을 탐색하고 원하는 것을 선택할 수 있습니다.

  Triggers: anygent list, list agents, show templates, 템플릿 목록, 에이전트 목록

  Use when user wants to browse available agent templates.
user-invocable: true
allowed-tools:
  - Read
---

# Anygent — 템플릿 마켓플레이스

> 바로 쓸 수 있는 직무별 에이전트 템플릿

## 사용 가능한 템플릿

다음 템플릿을 보여주세요:

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 Anygent 템플릿 마켓플레이스                                │
└─────────────────────────────────────────────────────────────┘

  📱  marketer          디지털 마케터
                        SNS 콘텐츠, 광고 카피, 트렌드 분석

  🎬  content-creator   콘텐츠 크리에이터
                        스크립트, 썸네일 아이디어, 댓글 관리

  📋  pm                프로덕트 매니저
                        PRD 작성, 스프린트 계획, 회의록

  🔬  researcher        리서처
                        자료 조사, 요약, 인사이트 도출

  💼  sales             영업 담당자
                        제안서, 고객 이메일, 협상 전략

  🎧  support           고객 지원
                        FAQ 작성, 답변 초안, 케이스 분류

─────────────────────────────────────────────────────────────
💡 설치: /anygent-install <템플릿ID>
✏️  직접 만들기: /anygent
```
