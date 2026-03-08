import chalk from 'chalk';
import { searchTemplates } from '../data/templates.js';
import { printBox } from '../utils/ui.js';

export function searchCommand(query: string) {
  const results = searchTemplates(query);

  printBox(`🔍 Search: "${query}"`);
  console.log();

  if (results.length === 0) {
    console.log(chalk.dim('  No templates found.'));
    console.log(chalk.dim('  Run `anygent list` to see all templates.'));
  } else {
    for (const t of results) {
      const id = chalk.bold.cyan(t.id.padEnd(18));
      const name = chalk.white(t.name_kr.padEnd(12));
      const tags = chalk.dim(t.tags.slice(0, 3).join(', '));
      console.log(`  ${t.emoji} ${id}${name}${tags}`);
    }
    console.log();
    console.log(chalk.dim(`  ${results.length} template(s) found`));
  }

  console.log();
}
