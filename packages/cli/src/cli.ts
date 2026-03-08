#!/usr/bin/env node

import { Command } from 'commander';
import { printBanner } from './utils/ui.js';
import { listCommand } from './commands/list.js';
import { installCommand } from './commands/install.js';
import { createCommand } from './commands/create.js';
import { searchCommand } from './commands/search.js';
import { infoCommand } from './commands/info.js';

const program = new Command();

program
  .name('anygent')
  .description('Build your own Claude agent')
  .version('0.1.0')
  .hook('preAction', () => {
    printBanner();
  });

program
  .command('list')
  .description('Show available agent templates')
  .action(() => {
    listCommand();
  });

program
  .command('install <template>')
  .description('Install a template (generate CLAUDE.md)')
  .action((template: string) => {
    installCommand(template);
  });

program
  .command('create')
  .description('Interactive interview to create a custom agent')
  .action(async () => {
    await createCommand();
  });

program
  .command('search <query>')
  .description('Search templates by keyword or tag')
  .action((query: string) => {
    searchCommand(query);
  });

program
  .command('info <template>')
  .description('Show details about a template')
  .action((template: string) => {
    infoCommand(template);
  });

program.parse();
