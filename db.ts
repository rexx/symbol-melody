import Dexie, { type Table } from 'dexie';
import { AppSetting, SymbolMapping } from './types';

export class SymbolMelodyDB extends Dexie {
  symbolMappings!: Table<SymbolMapping>;
  settings!: Table<AppSetting>;

  constructor() {
    super('SymbolMelodyDB');
    this.version(1).stores({
      symbolMappings: 'id, digit, pitchLevel, updatedAt',
      settings: 'key',
    });
    this.version(2).stores({
      symbolMappings: 'id, digit, pitchLevel, updatedAt',
      settings: 'key',
    });
  }
}

export const db = new SymbolMelodyDB();
