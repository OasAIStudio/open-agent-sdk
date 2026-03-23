/**
 * Codex Provider E2E Smoke Test
 * Uses real Codex OAuth credentials from the local Codex CLI cache.
 */

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { CodexProvider } from '../../../src/providers/codex';
import {
  TEST_CONFIG,
  isProviderAvailable,
  skipIfNoProvider,
} from '../setup';

const describeIfCodex = isProviderAvailable('codex') ? describe : describe.skip;

describeIfCodex('Codex Provider E2E', () => {
  let provider: CodexProvider;
  let tempDir: string;

  beforeAll(() => {
    skipIfNoProvider('codex');
    tempDir = mkdtempSync(join(tmpdir(), 'oas-codex-e2e-'));
    provider = new CodexProvider({
      model: TEST_CONFIG.codex.model,
      codexOAuth: {
        codexAuthPath: TEST_CONFIG.codex.authPath,
        credentialsPath: join(tempDir, 'providers.json'),
      },
    });
  });

  afterAll(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should connect with Codex OAuth and return a concise response', async () => {
    const messages = [
      {
        type: 'user' as const,
        uuid: 'test-uuid-codex-1',
        session_id: 'test-session-codex',
        message: {
          role: 'user' as const,
          content: 'Reply with exactly the single word: codex',
        },
        parent_tool_use_id: null,
      },
    ];

    const chunks: string[] = [];
    let usageReceived = false;

    for await (const chunk of provider.chat(messages)) {
      if (chunk.type === 'content') {
        chunks.push(chunk.delta || '');
      }
      if (chunk.type === 'usage') {
        usageReceived = true;
      }
      if (chunk.type === 'error') {
        throw new Error(chunk.error || 'Unknown Codex provider error');
      }
    }

    const response = chunks.join('').trim().toLowerCase();
    expect(response).toContain('codex');
    expect(usageReceived).toBe(true);
  }, TEST_CONFIG.timeout);
});
