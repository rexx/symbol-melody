import { useEffect, useMemo, useState } from 'react';
import { ImageIcon, LibraryBig, Music4 } from 'lucide-react';
import NotationEditorPage from './components/NotationEditorPage';
import PreviewPage from './components/PreviewPage';
import SymbolLibraryPage from './components/SymbolLibraryPage';
import { APP_NAME, EXAMPLE_SONGS, SAMPLE_NOTATION } from './constants';
import { db } from './db';
import { NotationParseError, PitchLevel, SymbolMapping, SymbolMappingView } from './types';
import { buildMappingId, parseNotation } from './utils/notation';

type ViewKey = 'editor' | 'library' | 'preview';

const NAV_ITEMS: { key: ViewKey; label: string; icon: typeof Music4 }[] = [
  { key: 'editor', label: 'Editor', icon: Music4 },
  { key: 'library', label: 'Library', icon: ImageIcon },
  { key: 'preview', label: 'Preview', icon: LibraryBig },
];

const toViewRecord = (mappings: SymbolMapping[]): Record<string, SymbolMappingView> => {
  return mappings.reduce<Record<string, SymbolMappingView>>((accumulator, mapping) => {
    accumulator[mapping.id] = {
      ...mapping,
      imageUrl: mapping.imageBlob ? URL.createObjectURL(mapping.imageBlob) : undefined,
    };
    return accumulator;
  }, {});
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>('preview');
  const [notationInput, setNotationInput] = useState(SAMPLE_NOTATION);
  const [activeExampleId, setActiveExampleId] = useState<string | null>(EXAMPLE_SONGS[0]?.id ?? null);
  const [showPitchLabels, setShowPitchLabels] = useState(false);
  const [parseErrors, setParseErrors] = useState<NotationParseError[]>([]);
  const [mappingViews, setMappingViews] = useState<Record<string, SymbolMappingView>>({});

  const parsedNotation = useMemo(() => parseNotation(notationInput), [notationInput]);

  useEffect(() => {
    setParseErrors(parsedNotation.errors);
  }, [parsedNotation.errors]);

  useEffect(() => {
    let disposed = false;

    const loadMappings = async () => {
      const records = await db.symbolMappings.toArray();
      const nextViews = toViewRecord(records);

      if (disposed) {
        Object.values(nextViews).forEach((mapping) => {
          if (mapping.imageUrl) {
            URL.revokeObjectURL(mapping.imageUrl);
          }
        });
        return;
      }

      setMappingViews((current) => {
        Object.values(current).forEach((mapping) => {
          if (mapping.imageUrl) {
            URL.revokeObjectURL(mapping.imageUrl);
          }
        });
        return nextViews;
      });
    };

    void loadMappings();

    return () => {
      disposed = true;
      setMappingViews((current) => {
        Object.values(current).forEach((mapping) => {
          if (mapping.imageUrl) {
            URL.revokeObjectURL(mapping.imageUrl);
          }
        });
        return {};
      });
    };
  }, []);

  const handleUpload = async (pitchLevel: PitchLevel, digit: string, file: File | null) => {
    if (!file) return;

    const record: SymbolMapping = {
      id: buildMappingId(pitchLevel, digit),
      digit,
      pitchLevel,
      imageBlob: file,
      imageMimeType: file.type || 'image/png',
      emoji: undefined,
      updatedAt: Date.now(),
    };

    await db.symbolMappings.put(record);
    const nextView: SymbolMappingView = {
      ...record,
      imageUrl: record.imageBlob ? URL.createObjectURL(record.imageBlob) : undefined,
    };

    setMappingViews((current) => {
      const existing = current[record.id];
      if (existing?.imageUrl) {
        URL.revokeObjectURL(existing.imageUrl);
      }
      return {
        ...current,
        [record.id]: nextView,
      };
    });
  };

  const handleSaveEmoji = async (pitchLevel: PitchLevel, digit: string, emoji: string) => {
    const trimmedEmoji = emoji.trim();
    const id = buildMappingId(pitchLevel, digit);

    if (!trimmedEmoji) {
      await handleRemove(pitchLevel, digit);
      return;
    }

    const existing = mappingViews[id];
    const record: SymbolMapping = {
      id,
      digit,
      pitchLevel,
      emoji: trimmedEmoji,
      imageBlob: undefined,
      imageMimeType: undefined,
      updatedAt: Date.now(),
    };

    await db.symbolMappings.put(record);

    setMappingViews((current) => {
      const next = { ...current };
      if (existing?.imageUrl) {
        URL.revokeObjectURL(existing.imageUrl);
      }
      next[id] = record;
      return next;
    });
  };

  const handleRemove = async (pitchLevel: PitchLevel, digit: string) => {
    const id = buildMappingId(pitchLevel, digit);
    await db.symbolMappings.delete(id);
    setMappingViews((current) => {
      const next = { ...current };
      if (next[id]?.imageUrl) {
        URL.revokeObjectURL(next[id].imageUrl);
      }
      delete next[id];
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff1d6_0%,#fff8ef_34%,#fff 100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <nav className="rounded-[2rem] border border-white/70 bg-white/70 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Project</p>
              <h1 className="mt-2 font-serif text-3xl">{APP_NAME}</h1>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] bg-[#fff4e2] p-2">
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                const isActive = key === activeView;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveView(key)}
                    className={`inline-flex items-center justify-center gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {activeView === 'editor' ? (
          <NotationEditorPage
            notationInput={notationInput}
            errors={parseErrors}
            examples={EXAMPLE_SONGS}
            activeExampleId={activeExampleId}
            onNotationChange={(value) => {
              setNotationInput(value);
              setActiveExampleId(null);
            }}
            onUseSample={() => {
              setNotationInput(SAMPLE_NOTATION);
              setActiveExampleId(EXAMPLE_SONGS[0]?.id ?? null);
            }}
            onSelectExample={(song) => {
              setNotationInput(song.notation);
              setActiveExampleId(song.id);
            }}
          />
        ) : null}

        {activeView === 'library' ? (
          <SymbolLibraryPage
            mappings={mappingViews}
            onUpload={handleUpload}
            onSaveEmoji={handleSaveEmoji}
            onRemove={handleRemove}
          />
        ) : null}

        {activeView === 'preview' ? (
          <PreviewPage
            tokens={parsedNotation.tokens}
            mappings={mappingViews}
            examples={EXAMPLE_SONGS}
            activeExampleId={activeExampleId}
            showPitchLabels={showPitchLabels}
            onSelectExample={(song) => {
              setNotationInput(song.notation);
              setActiveExampleId(song.id);
            }}
            onTogglePitchLabels={() => setShowPitchLabels((current) => !current)}
          />
        ) : null}
      </div>
    </main>
  );
}
