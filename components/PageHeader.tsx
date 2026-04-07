import { APP_NAME } from '../constants';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(247,148,29,0.18)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">{APP_NAME}</p>
      <div className="mt-3 space-y-2">
        <h1 className="font-serif text-3xl text-slate-900 sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p>
      </div>
    </header>
  );
}
