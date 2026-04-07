import { NotationParseError, NotationToken, ParseNotationResult, PitchLevel } from '../types';

const NOTE_PATTERN = /^(?<prefix>[\^_]?)(?<digit>[0-7])$/;

const getPitchLevel = (prefix: string): PitchLevel => {
  if (prefix === '^') return 'high';
  if (prefix === '_') return 'low';
  return 'mid';
};

const buildInvalidToken = (raw: string, message: string): NotationToken => ({
  kind: 'invalid',
  raw,
  message,
});

export const buildMappingId = (pitchLevel: PitchLevel, digit: string) => `${pitchLevel}:${digit}`;

export const parseNotation = (input: string): ParseNotationResult => {
  const tokens: NotationToken[] = [];
  const errors: NotationParseError[] = [];
  const lines = input.split('\n');

  lines.forEach((line, lineIndex) => {
    if (line.length === 0) {
      tokens.push({ kind: 'newline', raw: '\n' });
      return;
    }

    let cursor = 0;

    while (cursor < line.length) {
      const current = line[cursor];

      if (current === ' ' || current === '\t') {
        let end = cursor + 1;
        while (end < line.length && (line[end] === ' ' || line[end] === '\t')) {
          end += 1;
        }
        tokens.push({ kind: 'space', raw: line.slice(cursor, end) });
        cursor = end;
        continue;
      }

      let end = cursor + 1;
      while (end < line.length && line[end] !== ' ' && line[end] !== '\t') {
        end += 1;
      }

      const raw = line.slice(cursor, end);
      const match = raw.match(NOTE_PATTERN);

      if (!match?.groups) {
        errors.push({
          line: lineIndex + 1,
          column: cursor + 1,
          raw,
          message: 'Unsupported token. Use 0-7, ^n, or _n.',
        });
        tokens.push(buildInvalidToken(raw, 'Invalid token'));
        cursor = end;
        continue;
      }

      const { prefix, digit } = match.groups;
      const pitchLevel = getPitchLevel(prefix);
      tokens.push({
        kind: digit === '0' ? 'rest' : 'note',
        raw,
        digit,
        pitchLevel,
      });
      cursor = end;
    }

    if (lineIndex < lines.length - 1) {
      tokens.push({ kind: 'newline', raw: '\n' });
    }
  });

  return { tokens, errors };
};

export const tokensToRows = (tokens: NotationToken[]): NotationToken[][] => {
  const rows: NotationToken[][] = [[]];

  tokens.forEach((token) => {
    if (token.kind === 'newline') {
      rows.push([]);
      return;
    }
    rows[rows.length - 1].push(token);
  });

  return rows;
};
