import { createElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EXAMPLE_SONGS } from '../constants';
import PreviewPage from '../components/PreviewPage';
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

describe('EXAMPLE_SONGS', () => {
  it('contains the requested example songs', () => {
    expect(EXAMPLE_SONGS.map((song) => song.id)).toEqual(
      expect.arrayContaining(['butterfly', 'jingle-bells', 'river-water'])
    );
  });

  it('uses unique ids', () => {
    const ids = EXAMPLE_SONGS.map((song) => song.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains parseable notation', () => {
    EXAMPLE_SONGS.forEach((song) => {
      expect(parseNotation(song.notation).errors, song.id).toHaveLength(0);
    });
  });

  it('keeps the two tigers final phrase on low sol', () => {
    const twoTigers = EXAMPLE_SONGS.find((song) => song.id === 'two-tigers');

    expect(twoTigers?.notation.split('\n').slice(-2)).toEqual([
      '1 _5 1 1 _5 1',
      '1 _5 1 1 _5 1',
    ]);
  });
});

describe('PreviewPage', () => {
  it('leaves rests blank in the rendered score', () => {
    const parsed = parseNotation('1 0 2');

    render(
      createElement(PreviewPage, {
        tokens: parsed.tokens,
        mappings: {},
        examples: [],
        activeExampleId: null,
        showPitchLabels: true,
        onSelectExample: () => undefined,
        onTogglePitchLabels: () => undefined,
      })
    );

    expect(screen.getByLabelText('Default symbol for 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Default symbol for 2')).toBeInTheDocument();
    expect(screen.queryByLabelText('Default symbol for 0')).not.toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
