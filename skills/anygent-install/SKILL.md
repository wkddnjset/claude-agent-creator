---
name: anygent-install
description: |
  선택한 템플릿으로 CLAUDE.md를 즉시 생성합니다.
  marketer, pm, content-creator, researcher, sales, support 중 선택.

  Triggers: anygent install, install agent, 에이전트 설치, 템플릿 적용

  Use when user wants to quickly apply a pre-built template.
argument-hint: "<template-id>"
user-invocable: true
allowed-tools:
  - Read
  - Write
---

# Anygent Install — 템플릿으로 에이전트 설치

## 사용법

```
/anygent-install marketer
/anygent-install pm
/anygent-install content-creator
/anygent-install researcher
/anygent-install sales
/anygent-install support
```

---

## 실행 지침

사용자가 `/anygent-install <template>` 을 실행하면:

1. `${PLUGIN_ROOT}/templates/<template>.md` 파일을 읽으세요.
2. 현재 작업 디렉토리에 `CLAUDE.md`로 저장하세요.
3. 아래 메시지를 출력하세요:

```
✅ [템플릿 이름] 에이전트가 설치됐습니다!

📁 CLAUDE.md → 현재 폴더에 저장됨
🚀 이제 claude 명령어를 실행하면 이 에이전트로 시작합니다.

커스터마이징하려면:
  - CLAUDE.md를 직접 편집하거나
  - /anygent 를 실행해 인터뷰로 새로 만드세요
```

### 템플릿 ID가 없거나 잘못된 경우

```
사용 가능한 템플릿:
  marketer, content-creator, pm, researcher, sales, support

예) /anygent-install marketer
또는 /anygent-list 로 목록을 확인하세요.
```
