import chalk from 'chalk';
import { templates } from '../data/templates.js';
import { printBox } from '../utils/ui.js';

export function listCommand() {
  printBox('🤖 Anygent Marketplace');
  console.log();

  for (const t of templates) {
    const id = chalk.bold.cyan(t.id.padEnd(18));
    const name = chalk.white(t.name_kr.padEnd(12));
    const tags = chalk.dim(t.tags.slice(0, 3).join(', '));
    console.log(`  ${t.emoji} ${id}${name}${tags}`);
  }

  console.log();
  console.log(chalk.dim('  Usage: anygent install <template>'));
  console.log(chalk.dim('         anygent info <template>'));
  console.log();
}
