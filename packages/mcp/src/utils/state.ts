import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const STATE_DIR = '.anygent';

function ensureStateDir(): void {
  const dir = resolve(STATE_DIR);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function savePlan(plan: PlanData): void {
  ensureStateDir();
  writeFileSync(resolve(STATE_DIR, 'plan.json'), JSON.stringify(plan, null, 2), 'utf-8');
}

export function loadPlan(): PlanData | null {
  const path = resolve(STATE_DIR, 'plan.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function saveResearch(content: string): void {
  ensureStateDir();
  writeFileSync(resolve(STATE_DIR, 'research.md'), content, 'utf-8');
}

export function loadResearch(): string | null {
  const path = resolve(STATE_DIR, 'research.md');
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf-8');
}

export function saveDoResult(result: DoResult): void {
  ensureStateDir();
  writeFileSync(resolve(STATE_DIR, 'do-result.json'), JSON.stringify(result, null, 2), 'utf-8');
}

export function loadDoResult(): DoResult | null {
  const path = resolve(STATE_DIR, 'do-result.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

export function saveCheckReport(content: string): void {
  ensureStateDir();
  writeFileSync(resolve(STATE_DIR, 'check-report.md'), content, 'utf-8');
}

export interface PlanData {
  agentName: string;
  agentNameKr: string;
  purpose: string;
  targetUser: string;
  coreCapabilities: string[];
  requiredTools: string[];
  triggerConditions: string;
  outputFormat: string;
  tone: 'formal' | 'casual' | 'professional';
  language: 'ko' | 'en' | 'bilingual';
  doNotList: string[];
  successCriteria: string[];
  estimatedComplexity: 'simple' | 'medium' | 'complex';
}

export interface DoResult {
  outputDir: string;
  files: { path: string; description: string }[];
  createdAt: string;
  agentName: string;
}
