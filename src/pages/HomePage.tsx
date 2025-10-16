import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParticipantManager from '../components/ParticipantManager';
import ExpenseManager from '../components/ExpenseManager';
import IncomeManager from '../components/IncomeManager';
import TransferManager from '../components/TransferManager';
import SummaryPanel from '../components/SummaryPanel';

const HomePage = () => {
  const managementSections = useMemo(
    () => [
      {
        id: 'participants',
        label: 'Participants',
        description: 'Create your roster and personalise each member.',
        component: <ParticipantManager />,
      },
      {
        id: 'expenses',
        label: 'Expenses',
        description: 'Capture what everyone has paid so far.',
        component: <ExpenseManager />,
      },
      {
        id: 'income',
        label: 'Income',
        description: 'Log refunds or money flowing into the pot.',
        component: <IncomeManager />,
      },
      {
        id: 'transfers',
        label: 'Transfers',
        description: 'Track manual paybacks or adjustments.',
        component: <TransferManager />,
      },
    ],
    [],
  );

  const [activeSectionId, setActiveSectionId] = useState(managementSections[0].id);
  const activeSection = managementSections.find((section) => section.id === activeSectionId);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6 lg:max-w-6xl lg:px-8">
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
          <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-4 shadow-lg shadow-slate-950/40 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Workspace</p>
                  <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">Manage your shared wallet</h2>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-2 shadow-inner shadow-slate-950/60">
                <div className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-300 sm:grid-cols-4 sm:text-base">
                  {managementSections.map((section) => {
                    const isActive = section.id === activeSectionId;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSectionId(section.id)}
                        className={`w-full rounded-xl px-3 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                          isActive
                            ? 'bg-gradient-to-r from-ocean-500 via-blossom-500 to-ocean-400 text-white shadow-lg shadow-ocean-900/20'
                            : 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {activeSection ? (
                <div className="rounded-3xl border border-white/5 bg-white/5 p-5">
                  <p className="text-sm text-slate-300">{activeSection.description}</p>
                </div>
              ) : null}
            </div>
          </div>
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeSection ? (
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection.component}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="space-y-8">
          <SummaryPanel />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
