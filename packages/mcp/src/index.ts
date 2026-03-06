#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getInterviewQuestions, validateWorkflowData } from './tools/interview.js';
import { generateClaudeMd } from './tools/generate.js';
import { listTemplates, applyTemplate } from './tools/templates.js';
import { previewConfig } from './tools/preview.js';
import { saveConfig } from './tools/save.js';

const server = new Server(
  {
    name: 'anygent-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'interview_workflow',
      description:
        '워크플로우 인터뷰를 시작합니다. 사용자의 역할, 업무, 에이전트 목표 등을 파악하기 위한 질문을 제공합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
    {
      name: 'generate_claude_md',
      description:
        '인터뷰 답변을 바탕으로 CLAUDE.md 파일을 생성합니다. interview_workflow의 답변 데이터를 입력으로 받습니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          role: { type: 'string', description: '사용자의 역할 (예: 마케터, PM)' },
          dailyTasks: {
            oneOf: [
              { type: 'array', items: { type: 'string' } },
              { type: 'string' },
            ],
            description: '매일 반복하는 업무 목록 (배열 또는 쉼표 구분 문자열)',
          },
          agentGoal: { type: 'string', description: '에이전트가 도와줄 목표' },
          tonePreference: {
            type: 'string',
            enum: ['formal', 'casual', 'professional'],
            description: '말투 선호 (기본: professional)',
          },
          language: {
            type: 'string',
            enum: ['ko', 'en', 'bilingual'],
            description: '언어 설정 (기본: ko)',
          },
          additionalContext: {
            type: 'string',
            description: '추가 맥락 정보 (선택)',
          },
        },
        required: ['role', 'dailyTasks', 'agentGoal'],
      },
    },
    {
      name: 'list_templates',
      description:
        '사용 가능한 에이전트 템플릿 목록을 보여줍니다. 마케터, 크리에이터, PM, 리서처, 영업, 고객지원 등의 프리셋을 제공합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
    {
      name: 'apply_template',
      description:
        '선택한 템플릿을 적용하여 CLAUDE.md를 생성합니다. 필요시 회사명, 산업 등으로 커스터마이징할 수 있습니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          templateId: {
            type: 'string',
            description: '템플릿 ID (marketer, content-creator, pm, researcher, sales, support)',
          },
          companyName: { type: 'string', description: '회사명 (선택)' },
          industry: { type: 'string', description: '산업 분야 (선택)' },
          additionalInstructions: {
            type: 'string',
            description: '추가 지시사항 (선택)',
          },
        },
        required: ['templateId'],
      },
    },
    {
      name: 'preview_config',
      description:
        '생성된 CLAUDE.md 설정을 미리보기합니다. 구조, 섹션, 통계 정보를 확인할 수 있습니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          content: {
            type: 'string',
            description: '미리보기할 CLAUDE.md 내용',
          },
        },
        required: ['content'],
      },
    },
    {
      name: 'save_config',
      description:
        'CLAUDE.md 파일을 지정 경로에 저장합니다. 메타데이터(.anygent.json)도 함께 저장됩니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          content: {
            type: 'string',
            description: '저장할 CLAUDE.md 내용',
          },
          outputPath: {
            type: 'string',
            description: '저장 경로 (기본: ./CLAUDE.md)',
          },
        },
        required: ['content'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'interview_workflow': {
        const questions = getInterviewQuestions();
        return { content: [{ type: 'text', text: JSON.stringify(questions, null, 2) }] };
      }

      case 'generate_claude_md': {
        const workflowData = validateWorkflowData(args as Record<string, unknown>);
        const claudeMd = generateClaudeMd(workflowData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: 'CLAUDE.md가 생성되었습니다! preview_config로 미리보기하거나 save_config로 저장하세요.',
                  content: claudeMd,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'list_templates': {
        const templates = listTemplates();
        return { content: [{ type: 'text', text: JSON.stringify(templates, null, 2) }] };
      }

      case 'apply_template': {
        const { templateId, ...customization } = args as Record<string, string>;
        const hasCustomization = Object.keys(customization).length > 0;
        const claudeMd = applyTemplate(templateId, hasCustomization ? customization : undefined);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  message: `'${templateId}' 템플릿이 적용되었습니다! preview_config로 미리보기하거나 save_config로 저장하세요.`,
                  content: claudeMd,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case 'preview_config': {
        const { content } = args as { content: string };
        const preview = previewConfig(content);
        return { content: [{ type: 'text', text: JSON.stringify(preview, null, 2) }] };
      }

      case 'save_config': {
        const { content, outputPath } = args as { content: string; outputPath?: string };
        const result = saveConfig(content, outputPath);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      default:
        return {
          content: [{ type: 'text', text: `알 수 없는 도구입니다: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `오류: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Anygent MCP 서버가 시작되었습니다.');
}

main().catch((error) => {
  console.error('서버 시작 실패:', error);
  process.exit(1);
});
