import { ImagePlus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DEFAULT_SYMBOL_EMOJIS, DIGITS, PITCH_LABELS, PITCH_LEVELS } from '../constants';
import { SymbolMappingView } from '../types';
import { buildMappingId } from '../utils/notation';
import PageHeader from './PageHeader';

interface SymbolLibraryPageProps {
  mappings: Record<string, SymbolMappingView>;
  onUpload: (pitchLevel: 'low' | 'mid' | 'high', digit: string, file: File | null) => void;
  onSaveEmoji: (pitchLevel: 'low' | 'mid' | 'high', digit: string, emoji: string) => void;
  onRemove: (pitchLevel: 'low' | 'mid' | 'high', digit: string) => void;
}

function EmojiField({
  mappingKey,
  initialValue,
  onSave,
}: {
  mappingKey: string;
  initialValue: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, mappingKey]);

  return (
    <div className="mt-3 space-y-2">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type emoji"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      />
      <button
        type="button"
        onClick={() => onSave(value)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
      >
        <Save size={16} />
        Save Emoji
      </button>
    </div>
  );
}

export default function SymbolLibraryPage({ mappings, onUpload, onSaveEmoji, onRemove }: SymbolLibraryPageProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Build your symbol library"
        subtitle="Upload an image or type an emoji for each digit and pitch range. Changes are stored locally in this browser."
      />

      <div className="space-y-6">
        {PITCH_LEVELS.map((pitchLevel) => (
          <section key={pitchLevel} className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{PITCH_LABELS[pitchLevel]} Register</h2>
                <p className="text-sm text-slate-500">Assign shapes for {pitchLevel} notes and rests.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {DIGITS.map((digit) => {
                const mapping = mappings[buildMappingId(pitchLevel, digit)];
                return (
                  <article key={`${pitchLevel}-${digit}`} className="rounded-[1.75rem] border border-slate-200 bg-[#fffaf5] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{PITCH_LABELS[pitchLevel]}</p>
                        <h3 className="mt-2 font-mono text-3xl text-slate-900">{digit}</h3>
                      </div>
                      {mapping ? (
                        <button
                          type="button"
                          onClick={() => onRemove(pitchLevel, digit)}
                          className="rounded-full border border-rose-200 bg-white p-2 text-rose-500 transition hover:bg-rose-50"
                          aria-label={`Remove mapping for ${pitchLevel} ${digit}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 flex min-h-40 items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-slate-200 bg-white">
                      {mapping?.imageUrl ? (
                        <img
                          src={mapping.imageUrl}
                          alt={`${pitchLevel} ${digit}`}
                          className="h-36 w-full object-contain"
                        />
                      ) : mapping?.emoji ? (
                        <div className="text-6xl" aria-label={`Custom symbol for ${digit}`}>
                          {mapping.emoji}
                        </div>
                      ) : DEFAULT_SYMBOL_EMOJIS[digit] ? (
                        <div className="text-6xl" aria-label={`Default symbol for ${digit}`}>
                          {DEFAULT_SYMBOL_EMOJIS[digit]}
                        </div>
                      ) : (
                        <div className="px-4 text-center text-sm text-slate-400">No image assigned yet</div>
                      )}
                    </div>

                    <label className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                      <ImagePlus size={16} />
                      {mapping ? 'Replace Image' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          onUpload(pitchLevel, digit, event.target.files?.[0] ?? null);
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>

                    <EmojiField
                      mappingKey={`${pitchLevel}-${digit}`}
                      initialValue={mapping?.emoji ?? ''}
                      onSave={(emoji) => onSaveEmoji(pitchLevel, digit, emoji)}
                    />
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
