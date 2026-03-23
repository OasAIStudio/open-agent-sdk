import { beforeEach, describe, expect, mock, test } from 'bun:test';

import { CodexProvider } from '../../src/providers/codex';
import type { ToolDefinition } from '../../src/types/tools';

const mockStream = mock();
const mockGetModel = mock((provider: string, model: string) => ({ provider, model }));

mock.module('@mariozechner/pi-ai', () => ({
  stream: mockStream,
  getModel: mockGetModel,
}));

describe('CodexProvider', () => {
  beforeEach(() => {
    mockStream.mockReset();
    mockGetModel.mockClear();
  });

  test('maps pi-ai stream events to SDK chunks', async () => {
    mockStream.mockImplementation(() => (async function* () {
      yield {
        type: 'text_delta',
        delta: 'Hello',
      } as any;
      yield {
        type: 'toolcall_end',
        toolCall: {
          id: 'tool-1',
          name: 'get_weather',
          arguments: { location: 'Paris' },
        },
      } as any;
      yield {
        type: 'done',
        message: {
          usage: {
            input: 12,
            output: 7,
          },
        },
      } as any;
    })());

    const provider = new CodexProvider({
      apiKey: 'oauth-access-token',
      model: 'gpt-5.4',
    });

    const messages = [{
      type: 'user' as const,
      uuid: 'msg-1',
      session_id: 'session-1',
      message: { role: 'user' as const, content: 'Say hello and call the weather tool.' },
      parent_tool_use_id: null,
    }];

    const tools: ToolDefinition[] = [{
      type: 'function',
      function: {
        name: 'get_weather',
        description: 'Get the weather',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string' },
          },
          required: ['location'],
        },
      },
    }];

    const chunks = [];
    for await (const chunk of provider.chat(messages, tools)) {
      chunks.push(chunk);
    }

    expect(mockGetModel).toHaveBeenCalledWith('openai-codex', 'gpt-5.4');
    expect(chunks).toEqual([
      { type: 'content', delta: 'Hello' },
      {
        type: 'tool_call',
        tool_call: {
          id: 'tool-1',
          name: 'get_weather',
          arguments: JSON.stringify({ location: 'Paris' }),
        },
      },
      {
        type: 'usage',
        usage: {
          input_tokens: 12,
          output_tokens: 7,
        },
      },
      { type: 'done' },
    ]);
  });
});
