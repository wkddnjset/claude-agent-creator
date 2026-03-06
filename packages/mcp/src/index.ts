#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { handlePlan, type PlanInput } from './tools/plan.js';
import { handleResearch } from './tools/research.js';
import { handleDo, type DoInput } from './tools/do.js';
import { handleCheck } from './tools/check.js';

const server = new Server(
  {
    name: 'anygent-mcp',
    version: '0.2.0',
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
      name: 'anygent_plan',
      description:
        '에이전트 생성 계획을 수립합니다. 첫 호출 시 역질문을 생성하고, 답변과 함께 두 번째 호출 시 plan.json을 생성합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          request: {
            type: 'string',
            description: '만들고 싶은 에이전트에 대한 설명',
          },
          answers: {
            type: 'object',
            description: '역질문에 대한 답변 (두 번째 호출 시)',
            additionalProperties: { type: 'string' },
          },
        },
        required: ['request'],
      },
    },
    {
      name: 'anygent_research',
      description:
        'plan.json을 기반으로 구현 방향을 분석하고 research.md를 생성합니다. plan 단계가 완료되어야 실행 가능합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
    {
      name: 'anygent_do',
      description:
        'plan과 research를 기반으로 에이전트 파일(CLAUDE.md, README.md, scripts/)을 생성합니다. research 단계가 완료되어야 실행 가능합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {
          outputDir: {
            type: 'string',
            description: '출력 디렉토리 (기본: ./agent-output)',
          },
        },
      },
    },
    {
      name: 'anygent_check',
      description:
        '생성된 에이전트를 검수합니다. 시나리오 기반 시뮬레이션을 수행하고 검수 보고서를 생성합니다. do 단계가 완료되어야 실행 가능합니다.',
      inputSchema: {
        type: 'object' as const,
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'anygent_plan': {
        const result = handlePlan(args as unknown as PlanInput);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'anygent_research': {
        const result = handleResearch();
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'anygent_do': {
        const result = handleDo(args as DoInput);
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
      }

      case 'anygent_check': {
        const result = handleCheck();
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
  console.error('Anygent MCP 서버가 시작되었습니다. (v0.2.0 - 4단계 프로세스)');
}

main().catch((error) => {
  console.error('서버 시작 실패:', error);
  process.exit(1);
});
