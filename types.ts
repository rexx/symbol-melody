export type PitchLevel = 'low' | 'mid' | 'high';

export interface SymbolMapping {
  id: string;
  digit: string;
  pitchLevel: PitchLevel;
  imageBlob?: Blob;
  imageMimeType?: string;
  emoji?: string;
  updatedAt: number;
}

export interface SymbolMappingView extends SymbolMapping {
  imageUrl?: string;
}

export interface AppSetting {
  key: string;
  value: string;
}

export type TokenKind = 'note' | 'rest' | 'space' | 'newline' | 'invalid';

export interface NotationToken {
  kind: TokenKind;
  raw: string;
  digit?: string;
  pitchLevel?: PitchLevel;
  message?: string;
}

export interface NotationParseError {
  line: number;
  column: number;
  raw: string;
  message: string;
}

export interface ParseNotationResult {
  tokens: NotationToken[];
  errors: NotationParseError[];
}
