import { describe, expect, it } from 'vitest';
import { buildMappingId, parseNotation, tokensToRows } from './notation';

describe('parseNotation', () => {
  it('parses mid, high, low, and rest tokens', () => {
    const result = parseNotation('1 ^2 _3 0');
    const noteTokens = result.tokens.filter((token) => token.kind !== 'space');

    expect(result.errors).toHaveLength(0);
    expect(noteTokens).toEqual([
      { kind: 'note', raw: '1', digit: '1', pitchLevel: 'mid' },
      { kind: 'note', raw: '^2', digit: '2', pitchLevel: 'high' },
      { kind: 'note', raw: '_3', digit: '3', pitchLevel: 'low' },
      { kind: 'rest', raw: '0', digit: '0', pitchLevel: 'mid' },
    ]);
  });

  it('preserves new lines as separate preview rows', () => {
    const result = parseNotation('1 2\n_3 0');
    const rows = tokensToRows(result.tokens);

    expect(rows).toHaveLength(2);
    expect(rows[0].map((token) => token.raw)).toEqual(['1', ' ', '2']);
    expect(rows[1].map((token) => token.raw)).toEqual(['_3', ' ', '0']);
  });

  it('returns parse errors with line and column details', () => {
    const result = parseNotation('1 foo\n^2');

    expect(result.errors).toEqual([
      {
        line: 1,
        column: 3,
        raw: 'foo',
        message: 'Unsupported token. Use 0-7, ^n, or _n.',
      },
    ]);
  });
});

describe('buildMappingId', () => {
  it('builds a deterministic mapping id', () => {
    expect(buildMappingId('high', '7')).toBe('high:7');
  });
});
