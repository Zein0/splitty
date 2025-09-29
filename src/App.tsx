import ParticipantManager from './components/ParticipantManager';
import ExpenseManager from './components/ExpenseManager';
import IncomeManager from './components/IncomeManager';
import TransferManager from './components/TransferManager';
import SummaryPanel from './components/SummaryPanel';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-ocean-500/20 via-slate-900/40 to-slate-950 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <header className="text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ocean-100">
            Splitly+
          </span>
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Settle group expenses in seconds
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Add your crew, record expenses, incomes, or manual transfers and let Splitly+ calculate who owes whom. Beautiful summaries, instant PDF sharing, no sign-up required.
          </p>
        </header>

        <main className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-8">
            <ParticipantManager />
            <ExpenseManager />
            <IncomeManager />
            <TransferManager />
          </div>
          <div className="space-y-8">
            <SummaryPanel />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
