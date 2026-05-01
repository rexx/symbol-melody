import { PitchLevel } from './types';

export const APP_NAME = 'Symbol Melody';

export const PITCH_LEVELS: PitchLevel[] = ['low', 'mid', 'high'];

export const PITCH_LABELS: Record<PitchLevel, string> = {
  low: 'Low',
  mid: 'Mid',
  high: 'High',
};

export const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7'];

export const DEFAULT_SYMBOL_EMOJIS: Partial<Record<string, string>> = {
  '1': '❤️',
  '2': '🧡',
  '3': '💛',
  '4': '💚',
  '5': '🩵',
  '6': '💙',
  '7': '💜',
};

export interface ExampleSong {
  id: string;
  title: string;
  notation: string;
}

export const EXAMPLE_SONGS: ExampleSong[] = [
  {
    id: 'happy-birthday',
    title: '🎂 生日快樂',
    notation: [
      '1 1 2 1 4 3',
      '1 1 2 1 5 4',
      '1 1 ^1 6 4 3 2',
      '7 7 6 4 5 4',
    ].join('\n'),
  },
  {
    id: 'little-bee',
    title: '🐝 小蜜蜂',
    notation: [
      '5 3 3 4 2 2',
      '1 2 3 4 5 5 5',
      '5 3 3 4 2 2',
      '1 3 5 5 3',
      '2 2 2 2 2 3 4',
      '3 3 3 3 3 4 5',
      '5 3 3 4 2 2',
      '1 3 5 5 1',
    ].join('\n'),
  },
  {
    id: 'twinkle-star',
    title: '⭐ 小星星',
    notation: [
      '1 1 5 5 6 6 5',
      '4 4 3 3 2 2 1',
      '5 5 4 4 3 3 2',
      '5 5 4 4 3 3 2',
      '1 1 5 5 6 6 5',
      '4 4 3 3 2 2 1',
    ].join('\n'),
  },
  {
    id: 'two-tigers',
    title: '🐯 兩隻老虎',
    notation: [
      '1 2 3 1 1 2 3 1',
      '3 4 5 3 4 5',
      '5 6 5 4 3 1',
      '5 6 5 4 3 1',
      '1 _5 1 1 _5 1',
      '1 _5 1 1 _5 1',
    ].join('\n'),
  },
  {
    id: 'butterfly',
    title: '🦋 蝴蝶',
    notation: [
      '1 1 2 3 3 2 1 2 3 1',
      '3 3 4 5 5 4 3 4 5 3 0',
      '^1 7 6 5 3 ^1 7 6 5 0',
      '6 7 ^1 5 3 5 4 2 1',
    ].join('\n'),
  },
  {
    id: 'jingle-bells',
    title: '🔔 鈴兒響叮噹',
    notation: [
      '3 3 3 3 3 3',
      '3 5 1 2 3',
      '4 4 4 4 4 3 3',
      '3 2 2 3 2 5',
      '3 3 3 3 3 3',
      '3 5 1 2 3',
      '4 4 4 4 4 3 3',
      '5 5 4 2 1',
    ].join('\n'),
  },
  {
    id: 'river-water',
    title: '🌊 河水',
    notation: [
      '3 1 3 1 3 1 2',
      '2 3 4 2 3 1 2',
      '3 1 3 1 3 1 2',
      '2 3 4 2 3 1 0 0 0',
      '5 3 5 6 5 3 5 4',
      '4 2 4 3 1 3 2 2',
      '1 1 2 2 3 3 4',
      '3 2 1 2 1 _7 1 0 0 0',
    ].join('\n'),
  },
];

export const SAMPLE_NOTATION = EXAMPLE_SONGS[0].notation;

export const NOTATION_HELP = ['Mid: 1 2 3', 'High: ^1 ^2 ^3', 'Low: _5 _6 _7', 'Rest: 0'];
