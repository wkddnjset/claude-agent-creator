import { loadPlan, loadResearch, saveDoResult, type DoResult } from '../utils/state.js';
import {
  generateClaudeMd,
  generateReadme,
  generateInstallScript,
  writeGeneratedFiles,
  type GeneratedFile,
} from '../utils/fileGenerator.js';

export interface DoInput {
  outputDir?: string;
}

export function handleDo(input: DoInput): object {
  const plan = loadPlan();
  if (!plan) {
    return {
      error: true,
      message: 'plan.json이 없습니다. 먼저 anygent_plan을 실행해주세요.',
    };
  }

  const research = loadResearch();
  if (!research) {
    return {
      error: true,
      message: 'research.md가 없습니다. 먼저 anygent_research를 실행해주세요.',
    };
  }

  const outputDir = input.outputDir || './agent-output';
  const files: GeneratedFile[] = [];

  // CLAUDE.md
  files.push({
    path: 'CLAUDE.md',
    content: generateClaudeMd(plan, research),
    description: '에이전트 메인 설정파일 (시스템 프롬프트)',
  });

  // README.md
  files.push({
    path: 'README.md',
    content: generateReadme(plan),
    description: '에이전트 사용 가이드 (비개발자 친화적)',
  });

  // scripts/ (필요한 경우만)
  const hasTools = plan.requiredTools.some((t) => t !== '없음');
  if (hasTools) {
    files.push({
      path: 'scripts/install.sh',
      content: generateInstallScript(plan),
      description: '설치 스크립트',
    });
  }

  writeGeneratedFiles(outputDir, files);

  const doResult: DoResult = {
    outputDir,
    files: files.map((f) => ({ path: f.path, description: f.description })),
    createdAt: new Date().toISOString(),
    agentName: plan.agentName,
  };

  saveDoResult(doResult);

  return {
    message: `에이전트 파일이 생성되었습니다! \`${outputDir}/\` 폴더를 확인하세요.`,
    generatedFiles: files.map((f) => ({
      path: `${outputDir}/${f.path}`,
      description: f.description,
    })),
    nextStep: '다음 단계: anygent_check를 실행하여 검수하세요.',
  };
}
