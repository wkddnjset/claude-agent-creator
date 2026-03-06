export type { WorkflowTemplate } from './types.js';
export { marketerTemplate } from './marketer.js';
export { contentCreatorTemplate } from './content-creator.js';
export { pmTemplate } from './pm.js';
export { researcherTemplate } from './researcher.js';
export { salesTemplate } from './sales.js';
export { supportTemplate } from './support.js';

import { marketerTemplate } from './marketer.js';
import { contentCreatorTemplate } from './content-creator.js';
import { pmTemplate } from './pm.js';
import { researcherTemplate } from './researcher.js';
import { salesTemplate } from './sales.js';
import { supportTemplate } from './support.js';
import type { WorkflowTemplate } from './types.js';

export const allTemplates: WorkflowTemplate[] = [
  marketerTemplate,
  contentCreatorTemplate,
  pmTemplate,
  researcherTemplate,
  salesTemplate,
  supportTemplate,
];

export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return allTemplates.find((t) => t.id === id);
}
