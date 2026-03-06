import { allTemplates, getTemplateById } from '../templates/index.js';
import { generateFromTemplate } from './generate.js';

export function listTemplates(): object {
  return {
    count: allTemplates.length,
    templates: allTemplates.map((t) => ({
      id: t.id,
      name_kr: t.name_kr,
      name_en: t.name_en,
      description: t.description_kr,
      tags: t.tags,
      tone: t.tone,
      language: t.language,
    })),
  };
}

export function applyTemplate(
  templateId: string,
  customization?: Record<string, string>,
): string {
  const template = getTemplateById(templateId);
  if (!template) {
    const available = allTemplates.map((t) => t.id).join(', ');
    throw new Error(
      `템플릿 '${templateId}'을(를) 찾을 수 없습니다. 사용 가능한 템플릿: ${available}`,
    );
  }

  return generateFromTemplate(
    template.systemPrompt,
    template.name_kr,
    template.tone,
    template.language,
    customization,
  );
}
