import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { printSuccess, printError, printInfo } from '../utils/ui.js';

export async function createCommand() {
  console.log();
  console.log(chalk.bold('  🛠  Create a custom agent'));
  console.log(chalk.dim('  Answer a few questions to build your agent.\n'));

  const name = await input({
    message: 'Agent name (Korean)',
    validate: (v) => (v.trim() ? true : 'Required'),
  });

  const nameEn = await input({
    message: 'Agent name (English)',
    validate: (v) => (v.trim() ? true : 'Required'),
  });

  const purpose = await input({
    message: 'What does this agent do? (1-2 sentences)',
    validate: (v) => (v.trim() ? true : 'Required'),
  });

  const capabilities = await input({
    message: 'Core capabilities (comma-separated)',
    validate: (v) => (v.trim() ? true : 'Required'),
  });

  const tone = await select({
    message: 'Tone',
    choices: [
      { name: 'Professional', value: 'professional' },
      { name: 'Formal', value: 'formal' },
      { name: 'Casual', value: 'casual' },
    ],
  });

  const doNotList = await input({
    message: 'Things the agent should NOT do (comma-separated, or leave empty)',
  });

  const outputFormat = await input({
    message: 'Output format preference',
    default: 'Markdown',
  });

  const outputPath = join(process.cwd(), 'CLAUDE.md');

  if (existsSync(outputPath)) {
    printError('CLAUDE.md already exists in this directory.');
    printInfo('Delete it first or use a different directory.');
    process.exit(1);
  }

  const capsList = capabilities
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const doNots = doNotList
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  const toneKr =
    tone === 'formal' ? '격식체' : tone === 'casual' ? '캐주얼' : '프로페셔널';

  let content = `# ${name} (${nameEn})

## 역할
${purpose}

## 핵심 원칙
${capsList.map((c) => `- ${c}`).join('\n')}

## 동작 방식
- 톤: ${toneKr}
- 출력 형식: ${outputFormat}
`;

  if (doNots.length > 0) {
    content += `
## 하지 말아야 할 것
${doNots.map((d) => `- ${d}`).join('\n')}
`;
  }

  writeFileSync(outputPath, content, 'utf-8');

  console.log();
  printSuccess(`CLAUDE.md created for ${chalk.bold(name)}`);
  printInfo(`Run ${chalk.cyan('claude')} to start your agent`);
  console.log();
}
