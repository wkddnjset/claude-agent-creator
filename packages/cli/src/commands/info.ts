import chalk from 'chalk';
import { getTemplateById } from '../data/templates.js';
import { printError } from '../utils/ui.js';

export function infoCommand(templateId: string) {
  const template = getTemplateById(templateId);

  if (!template) {
    printError(`Template "${templateId}" not found.`);
    console.log(chalk.dim('  Run `anygent list` to see available templates.'));
    process.exit(1);
  }

  console.log();
  console.log(`  ${template.emoji} ${chalk.bold.white(template.name_kr)} ${chalk.dim(`(${template.name_en})`)}`);
  console.log(chalk.dim('  ─'.repeat(20)));
  console.log();
  console.log(`  ${chalk.dim('Description:')} ${template.description_kr}`);
  console.log(`  ${chalk.dim('Tone:')}        ${template.tone}`);
  console.log(`  ${chalk.dim('Language:')}    ${template.language}`);
  console.log(`  ${chalk.dim('Tools:')}       ${template.suggestedTools.join(', ')}`);
  console.log(`  ${chalk.dim('Tags:')}        ${template.tags.map((t) => chalk.hex('#7c6ff7')(t)).join('  ')}`);
  console.log();
  console.log(chalk.dim('  System Prompt:'));
  console.log();
  for (const line of template.systemPrompt.split('\n')) {
    console.log(`  ${chalk.white(line)}`);
  }
  console.log();
  console.log(chalk.dim(`  Install: anygent install ${template.id}`));
  console.log();
}
