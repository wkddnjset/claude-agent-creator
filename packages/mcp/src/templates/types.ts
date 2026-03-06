export interface WorkflowTemplate {
  id: string;
  name_kr: string;
  name_en: string;
  description_kr: string;
  tags: string[];
  systemPrompt: string;
  tone: 'formal' | 'casual' | 'professional';
  language: 'ko' | 'en' | 'bilingual';
  suggestedTools: string[];
}
