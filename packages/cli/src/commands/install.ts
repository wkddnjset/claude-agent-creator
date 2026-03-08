import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import { getTemplateById } from '../data/templates.js';
import { printSuccess, printError, printInfo } from '../utils/ui.js';
import type { Template } from '../data/templates.js';

function generateClaudeMd(template: Template): string {
  return `# ${template.name_kr} (${template.name_en})

## 역할
${template.description_kr}

${template.systemPrompt}

## 톤
${template.tone === 'formal' ? '격식체' : template.tone === 'casual' ? '캐주얼' : '프로페셔널'}

## 언어
${template.language === 'ko' ? '한국어' : template.language === 'en' ? 'English' : '한국어/English'}

## 추천 도구
${template.suggestedTools.map((t) => `- ${t}`).join('\n')}
`;
}

export function installCommand(templateId: string) {
  const template = getTemplateById(templateId);

  if (!template) {
    printError(`Template "${templateId}" not found.`);
    console.log(chalk.dim('  Run `anygent list` to see available templates.'));
    process.exit(1);
  }

  const outputPath = join(process.cwd(), 'CLAUDE.md');

  if (existsSync(outputPath)) {
    printError('CLAUDE.md already exists in this directory.');
    printInfo('Delete it first or use a different directory.');
    process.exit(1);
  }

  const content = generateClaudeMd(template);
  writeFileSync(outputPath, content, 'utf-8');

  console.log();
  printSuccess(`CLAUDE.md created for ${chalk.bold(template.name_kr)}`);
  printInfo(`Run ${chalk.cyan('claude')} to start your agent`);
  console.log();
}
