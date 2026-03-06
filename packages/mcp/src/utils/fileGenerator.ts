import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import type { PlanData } from './state.js';

export interface GeneratedFile {
  path: string;
  content: string;
  description: string;
}

const toneMap: Record<string, string> = {
  formal: '격식체로 작성합니다. 존댓말을 사용합니다.',
  casual: '친근하고 편안한 말투를 사용합니다.',
  professional: '전문적이고 간결한 톤을 사용합니다.',
};

const languageMap: Record<string, string> = {
  ko: '모든 응답은 한국어로 작성합니다.',
  en: 'All responses should be written in English.',
  bilingual: '한국어를 기본으로 사용하되, 필요시 영어를 병행합니다.',
};

export function generateClaudeMd(plan: PlanData, researchContent: string): string {
  const capabilities = plan.coreCapabilities.map((c) => `- ${c}`).join('\n');
  const doNotList = plan.doNotList.map((d) => `- ${d}`).join('\n');

  return `# ${plan.agentNameKr} (${plan.agentName})

## 역할
${plan.purpose}

## 핵심 원칙
${capabilities}

## 동작 방식
- 트리거 조건: ${plan.triggerConditions}
- 대상 사용자: ${plan.targetUser}
- ${toneMap[plan.tone]}
- ${languageMap[plan.language]}

## 하지 말아야 할 것
${doNotList}

## 응답 형식
${plan.outputFormat}
`;
}

export function generateReadme(plan: PlanData): string {
  return `# ${plan.agentNameKr} (${plan.agentName})

## 소개
${plan.purpose}

## 사용 방법

### 1. 설치
\`\`\`bash
# install.sh 실행 (scripts 폴더가 있는 경우)
chmod +x scripts/install.sh && ./scripts/install.sh
\`\`\`

### 2. 실행
이 폴더를 Claude Code의 작업 디렉토리로 설정하면 CLAUDE.md가 자동으로 로드됩니다.

## 주요 기능
${plan.coreCapabilities.map((c) => `- ${c}`).join('\n')}

## 주의사항
${plan.doNotList.map((d) => `- ${d}`).join('\n')}

## 성공 기준
${plan.successCriteria.map((s) => `- ${s}`).join('\n')}
`;
}

export function generateInstallScript(plan: PlanData): string {
  return `#!/bin/bash
# ${plan.agentNameKr} 설치 스크립트
set -e

echo "${plan.agentNameKr} 설치를 시작합니다..."

# 필요한 디렉토리 생성
mkdir -p scripts

echo "설치가 완료되었습니다!"
echo "CLAUDE.md 파일이 준비되었습니다."
`;
}

export function writeGeneratedFiles(outputDir: string, files: GeneratedFile[]): void {
  for (const file of files) {
    const fullPath = resolve(outputDir, file.path);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(fullPath, file.content, 'utf-8');
  }
}
