import { LLMProvider, type ProviderConfig, type LLMChunk, type ChatOptions } from './base';
import type {
  AssistantMessage as PiAssistantMessage,
  AssistantMessageEvent,
  Context as PiContext,
  Message as PiMessage,
  Tool as PiTool,
  ToolCall as PiToolCall,
  Usage as PiUsage,
} from '@mariozechner/pi-ai';
import type { AssistantContentBlock, SDKMessage } from '../types/messages';
import type { ToolDefinition } from '../types/tools';
import { resolveCodexOAuthApiKey, type CodexOAuthOptions } from '../auth/codex';

const DEFAULT_CODEX_SYSTEM_PROMPT = 'You are a helpful assistant.';

const ZERO_USAGE = {
  cacheRead: 0,
  cacheWrite: 0,
  cost: {
    cacheRead: 0,
    cacheWrite: 0,
    input: 0,
    output: 0,
    total: 0,
  },
  input: 0,
  output: 0,
  totalTokens: 0,
} as const;

type PiAiModule = typeof import('@mariozechner/pi-ai');

let piAiModulePromise: Promise<PiAiModule> | null = null;

function loadPiAiModule(): Promise<PiAiModule> {
  piAiModulePromise ??= import('@mariozechner/pi-ai');
  return piAiModulePromise;
}

function toTimestamp(value?: string): number {
  if (!value) {
    return Date.now();
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function toUsage(usage: PiUsage | undefined): NonNullable<LLMChunk['usage']> {
  return {
    input_tokens: usage?.input ?? 0,
    output_tokens: usage?.output ?? 0,
  };
}

function toPiToolCall(toolCall: PiToolCall): NonNullable<LLMChunk['tool_call']> {
  return {
    id: toolCall.id,
    name: toolCall.name,
    arguments: JSON.stringify(toolCall.arguments ?? {}),
  };
}

function buildAssistantHistoryMessage(message: Extract<SDKMessage, { type: 'assistant' }>): PiAssistantMessage {
  const textBlocks = message.message.content
    .filter((block: AssistantContentBlock): block is AssistantContentBlock & { type: 'text'; text: string } => block.type === 'text')
    .map((block) => ({
      type: 'text' as const,
      text: block.text,
    }));

  const toolBlocks = (message.message.tool_calls ?? []).map((toolCall) => ({
    type: 'toolCall' as const,
    id: toolCall.id,
    name: toolCall.function.name,
    arguments: JSON.parse(toolCall.function.arguments || '{}') as Record<string, unknown>,
  }));

  return {
    role: 'assistant',
    api: 'openai-codex-responses',
    provider: 'openai-codex',
    model: message.model ?? 'unknown',
    content: [...textBlocks, ...toolBlocks],
    usage: {
      ...ZERO_USAGE,
      input: message.usage?.input_tokens ?? 0,
      output: message.usage?.output_tokens ?? 0,
      totalTokens: (message.usage?.input_tokens ?? 0) + (message.usage?.output_tokens ?? 0),
      cost: {
        ...ZERO_USAGE.cost,
        total: 0,
      },
    },
    stopReason: message.stop_reason === 'tool_use' ? 'toolUse' : 'stop',
    timestamp: toTimestamp(message.timestamp),
  };
}

export interface CodexConfig extends ProviderConfig {
  codexOAuth?: CodexOAuthOptions;
  transport?: 'sse' | 'websocket' | 'auto';
}

export class CodexProvider extends LLMProvider {
  private codexOAuth?: CodexOAuthOptions;
  private transport: 'sse' | 'websocket' | 'auto';

  constructor(config: CodexConfig) {
    super(config);
    this.codexOAuth = config.codexOAuth;
    this.transport = config.transport ?? 'sse';
  }

  async *chat(
    messages: SDKMessage[],
    tools?: ToolDefinition[],
    signal?: AbortSignal,
    options?: ChatOptions
  ): AsyncIterable<LLMChunk> {
    if (options?.outputSchema) {
      yield { type: 'error', error: 'Structured output is not supported by the Codex provider.' };
      yield { type: 'done' };
      return;
    }

    try {
      const { getModel, stream } = await loadPiAiModule();
      const auth = this.config.apiKey
        ? { apiKey: this.config.apiKey }
        : await resolveCodexOAuthApiKey(this.codexOAuth);
      const sessionId = messages.find((message) => message.type !== 'system')?.session_id;
      const model = getModel(
        'openai-codex',
        this.config.model as Parameters<typeof getModel>[1]
      );
      const context: PiContext = {
        messages: this.convertMessages(messages),
        systemPrompt: options?.systemInstruction ?? DEFAULT_CODEX_SYSTEM_PROMPT,
        ...(tools?.length ? { tools: this.convertTools(tools) } : {}),
      };

      const responseStream = stream(model, context, {
        apiKey: auth.apiKey,
        transport: this.transport,
        signal,
        ...(sessionId ? { sessionId } : {}),
      });

      for await (const event of responseStream) {
        yield* this.handleEvent(event);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      yield { type: 'error', error: message };
      yield { type: 'done' };
    }
  }

  private *handleEvent(event: AssistantMessageEvent): Iterable<LLMChunk> {
    switch (event.type) {
      case 'text_delta':
        yield { type: 'content', delta: event.delta };
        return;
      case 'toolcall_end':
        yield { type: 'tool_call', tool_call: toPiToolCall(event.toolCall) };
        return;
      case 'done':
        yield { type: 'usage', usage: toUsage(event.message.usage) };
        yield { type: 'done' };
        return;
      case 'error':
        yield {
          type: 'error',
          error: event.error.errorMessage || `Codex stream ended with ${event.reason}.`,
        };
        yield { type: 'done' };
        return;
      default:
        return;
    }
  }

  private convertMessages(messages: SDKMessage[]): PiMessage[] {
    const converted: PiMessage[] = [];

    for (const message of messages) {
      if (message.type === 'system') {
        continue;
      }

      if (message.type === 'user') {
        converted.push({
          role: 'user',
          content: message.message.content,
          timestamp: toTimestamp(message.timestamp),
        });
        continue;
      }

      if (message.type === 'assistant') {
        converted.push(buildAssistantHistoryMessage(message));
        continue;
      }

      if (message.type === 'tool_result') {
        const outputValue = typeof message.result === 'string' ? message.result : JSON.stringify(message.result);
        converted.push({
          role: 'toolResult',
          toolCallId: message.tool_use_id,
          toolName: message.tool_name,
          content: [{
            type: 'text',
            text: outputValue,
          }],
          isError: message.is_error,
          timestamp: Date.now(),
        });
      }
    }

    return converted;
  }

  private convertTools(tools: ToolDefinition[]): PiTool[] {
    return tools.map((tool) => ({
      name: tool.function.name,
      description: tool.function.description,
      parameters: tool.function.parameters as unknown as PiTool['parameters'],
    }));
  }
}
