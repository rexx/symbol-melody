import { FileMusic, Sparkles, TriangleAlert } from 'lucide-react';
import { ExampleSong, NOTATION_HELP } from '../constants';
import { NotationParseError } from '../types';
import PageHeader from './PageHeader';

interface NotationEditorPageProps {
  notationInput: string;
  errors: NotationParseError[];
  examples: ExampleSong[];
  activeExampleId: string | null;
  onNotationChange: (value: string) => void;
  onUseSample: () => void;
  onSelectExample: (song: ExampleSong) => void;
}

export default function NotationEditorPage({
  notationInput,
  errors,
  examples,
  activeExampleId,
  onNotationChange,
  onUseSample,
  onSelectExample,
}: NotationEditorPageProps) {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Compose with numbers"
        subtitle="Type numbered notation with plain ASCII syntax. Use ^ for high notes, _ for low notes, and 0 for rests."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-500">
                <FileMusic size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Notation Input</h2>
                <p className="text-sm text-slate-500">Spaces and line breaks are preserved in the preview.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onUseSample}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              <Sparkles size={16} />
              Use Sample
            </button>
          </div>

          <textarea
            value={notationInput}
            onChange={(event) => onNotationChange(event.target.value)}
            className="h-[320px] w-full resize-none rounded-[1.5rem] border border-slate-200 bg-[#fffaf4] p-4 font-mono text-base leading-7 text-slate-900 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
            placeholder="1 2 3 4&#10;^5 ^3 2 0&#10;_5 _6 _7 1"
            spellCheck={false}
          />

          <div className="mt-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">Example Songs</p>
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
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    {song.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-black/10 bg-[#fff7ed] p-5 shadow-[0_16px_50px_rgba(251,146,60,0.12)]">
            <h2 className="text-lg font-semibold text-slate-900">Syntax Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {NOTATION_HELP.map((item) => (
                <li key={item} className="rounded-2xl bg-white/80 px-4 py-3 font-mono">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl p-3 ${errors.length > 0 ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-500'}`}>
                <TriangleAlert size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Parse Status</h2>
                <p className="text-sm text-slate-500">
                  {errors.length > 0 ? `${errors.length} issue(s) found` : 'Everything looks valid'}
                </p>
              </div>
            </div>

            {errors.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {errors.map((error, index) => (
                  <li key={`${error.line}-${error.column}-${index}`} className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    Line {error.line}, Col {error.column}: `{error.raw}` {error.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
