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
    return <div className="h-24 min-w-4" aria-hidden="true" />;
  }

  if (token.kind === 'invalid') {
    return (
      <div className="flex h-24 min-w-20 items-center justify-center rounded-[1.25rem] border border-rose-200 bg-rose-50 px-3 text-center font-mono text-sm text-rose-600">
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
    <div className="flex min-w-20 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
      {showPitchLabels ? (
        <div className="flex justify-start px-3 pt-3">
          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeClassName}`}>
            {pitchLabel}
          </span>
        </div>
      ) : null}
      <div className={`flex items-center justify-center px-3 ${showPitchLabels ? 'h-20 pb-3' : 'h-24 py-3'}`}>
        {mapping?.imageUrl ? (
          <img src={mapping.imageUrl} alt={token.raw} className="h-16 w-16 object-contain" />
        ) : mapping?.emoji ? (
          <span className="text-5xl" aria-label={`Custom symbol for ${token.raw}`}>
            {mapping.emoji}
          </span>
        ) : DEFAULT_SYMBOL_EMOJIS[token.digit] ? (
          <span className="text-5xl" aria-label={`Default symbol for ${token.raw}`}>
            {DEFAULT_SYMBOL_EMOJIS[token.digit]}
          </span>
        ) : (
          <span className="font-mono text-3xl text-slate-700">{token.raw}</span>
        )}
      </div>
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
    <section className="space-y-6">
      <PageHeader
        title="Preview the symbol score"
        subtitle="Every parsed token is rendered with its saved image. Missing mappings fall back to the original numbered notation."
      />

      <section className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Example Songs</h2>
            <p className="text-sm text-slate-500">Switch songs directly from preview without going back to the editor.</p>
          </div>
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
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="mb-5 rounded-[1.5rem] border border-slate-200 bg-[#fff9f1] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Score Title</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            {activeExample?.title ?? 'Custom Score'}
          </h3>
        </div>

        <div className="space-y-4">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex min-h-24 flex-wrap items-center gap-3 rounded-[1.5rem] bg-[#fff9f1] p-4">
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
