import chalk from 'chalk';

export function printBanner() {
  const banner = `
  ${chalk.bold.hex('#7c6ff7')('any')}${chalk.bold.hex('#a78bfa')('gent')}  ${chalk.dim('v0.1.0')}
  ${chalk.dim('─────────────────────────')}
  ${chalk.dim('Build your own Claude agent')}
`;
  console.log(banner);
}

export function printBox(title: string) {
  const line = '─'.repeat(49);
  console.log(chalk.hex('#7c6ff7')(`  ┌${line}┐`));
  console.log(chalk.hex('#7c6ff7')(`  │  ${chalk.bold(title).padEnd(56)}│`));
  console.log(chalk.hex('#7c6ff7')(`  └${line}┘`));
}

export function printSuccess(message: string) {
  console.log(chalk.green('  ✓ ') + message);
}

export function printError(message: string) {
  console.log(chalk.red('  ✗ ') + message);
}

export function printInfo(message: string) {
  console.log(chalk.dim('  → ') + message);
}
