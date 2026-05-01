import { Eye } from 'lucide-react';
import { DEFAULT_SYMBOL_EMOJIS, ExampleSong } from '../constants';
import { NotationToken, SymbolMappingView } from '../types';
import { buildMappingId, tokensToRows } from '../utils/notation';
import PageHeader from './PageHeader';

interface PreviewPageProps {
  tokens: NotationToken[];
  mappings: Record<string, SymbolMappingView>;
  examples: ExampleSong[];
  activeExampleId: string | null;
  showPitchLabels: boolean;
  onSelectExample: (song: ExampleSong) => void;
  onTogglePitchLabels: () => void;
}

const renderToken = (
  token: NotationToken,
  mappings: Record<string, SymbolMappingView>,
  showPitchLabels: boolean
) => {
  if (token.kind === 'space') {
    return <div className="h-14 min-w-3" aria-hidden="true" />;
  }

  if (token.kind === 'rest') {
    return <div className="h-14 min-w-12" aria-hidden="true" />;
  }

  if (token.kind === 'invalid') {
    return (
      <div className="flex h-14 min-w-16 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-2 text-center font-mono text-xs text-rose-600">
        {token.raw}
      </div>
    );
  }

  if (!token.digit || !token.pitchLevel) {
    return null;
  }

  const mapping = mappings[buildMappingId(token.pitchLevel, token.digit)];
  const pitchLabel = token.pitchLevel === 'high' ? 'High' : token.pitchLevel === 'low' ? 'Low' : 'Mid';
  const badgeClassName =
    token.pitchLevel === 'high'
      ? 'bg-sky-100 text-sky-700'
      : token.pitchLevel === 'low'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-amber-100 text-amber-700';

  return (
    <div className="flex min-w-12 flex-col items-center justify-center">
      <div className={`flex items-center justify-center ${showPitchLabels ? 'h-10' : 'h-12'}`}>
        {mapping?.imageUrl ? (
          <img src={mapping.imageUrl} alt={token.raw} className="h-10 w-10 object-contain" />
        ) : mapping?.emoji ? (
          <span className="inline-block text-4xl leading-none" aria-label={`Custom symbol for ${token.raw}`}>
            {mapping.emoji}
          </span>
        ) : DEFAULT_SYMBOL_EMOJIS[token.digit] ? (
          <span className="inline-block text-4xl leading-none" aria-label={`Default symbol for ${token.raw}`}>
            {DEFAULT_SYMBOL_EMOJIS[token.digit]}
          </span>
        ) : (
          <span className="font-mono text-2xl text-slate-700">{token.raw}</span>
        )}
      </div>
      {showPitchLabels ? (
        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] ${badgeClassName}`}>
          {pitchLabel}
        </span>
      ) : null}
    </div>
  );
};

export default function PreviewPage({
  tokens,
  mappings,
  examples,
  activeExampleId,
  showPitchLabels,
  onSelectExample,
  onTogglePitchLabels,
}: PreviewPageProps) {
  const rows = tokensToRows(tokens);
  const activeExample = examples.find((song) => song.id === activeExampleId) ?? null;

  return (
    <section className="space-y-4">
      <PageHeader
        title="Preview the symbol score"
        subtitle="Parsed notes are rendered with saved images. Missing mappings fall back to the original numbered notation."
      />

      <section className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]" aria-label="Example songs">
        <div className="flex flex-wrap gap-2">
          {examples.map((song) => {
            const isActive = song.id === activeExampleId;
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => onSelectExample(song)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {song.title}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-500">
              <Eye size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Rendered Score</h2>
              <p className="text-sm text-slate-500">Line breaks from the editor are preserved below.</p>
            </div>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={showPitchLabels}
              onChange={onTogglePitchLabels}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            Show mid / high / low
          </label>
        </div>

        <div className="mb-4 rounded-[1.5rem] border border-slate-200 bg-[#fff9f1] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Score Title</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {activeExample?.title ?? 'Custom Score'}
          </h3>
        </div>

        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex min-h-16 flex-wrap items-center gap-2 rounded-[1.25rem] bg-[#fff9f1] px-3 py-2">
              {row.length > 0 ? row.map((token, tokenIndex) => <div key={`${rowIndex}-${tokenIndex}`}>{renderToken(token, mappings, showPitchLabels)}</div>) : (
                <div className="text-sm text-slate-400">Empty line</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
