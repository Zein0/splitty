import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useFinanceStore } from '../store/useFinanceStore';
import SectionCard from './SectionCard';
import { buildFinanceSummary } from '../utils/summary';
import { formatCurrency } from '../utils/money';

const SummaryPanel = () => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const { participants, expenses, incomes, transfers, resetAll } = useFinanceStore();
  const [isExporting, setIsExporting] = useState(false);

  const summary = useMemo(
    () => buildFinanceSummary(participants, expenses, incomes, transfers),
    [participants, expenses, incomes, transfers],
  );

  const handleExportPdf = async () => {
    if (!summaryRef.current) {
      return;
    }
    setIsExporting(true);
    try {
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#020617',
        scale: 2,
      });
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const width = canvas.width * ratio;
      const height = canvas.height * ratio;
      const offsetX = (pageWidth - width) / 2;
      const offsetY = 20;
      pdf.addImage(imageData, 'PNG', offsetX, offsetY, width, height);
      pdf.save('splitly-breakdown.pdf');
    } finally {
      setIsExporting(false);
    }
  };

  const hasData =
    participants.length > 0 || expenses.length > 0 || incomes.length > 0 || transfers.length > 0;

  return (
    <SectionCard
      title="Breakdown"
      description="Live balances, smart settlements, and totals update automatically with every change."
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={!hasData || isExporting}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isExporting ? 'Preparing PDF…' : 'Share breakdown'}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-red-400/40 hover:text-red-200"
          >
            Reset data
          </button>
        </div>
      }
    >
      <div ref={summaryRef} className="space-y-6">
        <div className="grid gap-4 rounded-3xl border border-white/5 bg-slate-950/60 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-ocean-500/20 via-ocean-500/10 to-transparent p-5">
              <p className="text-sm uppercase tracking-wide text-slate-400">Total expenses</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(summary.totalExpenses)}
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blossom-500/20 via-blossom-500/10 to-transparent p-5">
              <p className="text-sm uppercase tracking-wide text-slate-400">Total income</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCurrency(summary.totalIncomes)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Individual breakdown
          </h3>
          <div className="overflow-hidden rounded-3xl border border-white/5">
            <div className="hidden grid-cols-4 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-300 sm:grid">
              <span>Participant</span>
              <span className="text-right">Paid</span>
              <span className="text-right">Income</span>
              <span className="text-right">Balance</span>
            </div>
            <div className="divide-y divide-white/5">
              {summary.breakdown.map(({ participant, balance, spent, received }) => (
                <motion.div
                  layout
                  key={participant.id}
                  className="grid grid-cols-1 gap-3 bg-slate-900/30 px-4 py-4 text-sm text-slate-200 sm:grid-cols-4 sm:items-center sm:px-6"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-2xl text-xl"
                      style={{ background: `${participant.color}1a`, color: participant.color }}
                    >
                      {participant.emoji ?? '👤'}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{participant.name}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-400 sm:hidden">Participant</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs uppercase tracking-wide text-slate-400 sm:hidden">Paid</span>
                    <span className="font-medium text-ocean-100">
                      {formatCurrency(spent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs uppercase tracking-wide text-slate-400 sm:hidden">Income</span>
                    <span className="font-medium text-blossom-100">
                      {formatCurrency(received)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:block">
                    <span className="text-xs uppercase tracking-wide text-slate-400 sm:hidden">Balance</span>
                    <span
                      className={balance >= 0 ? 'font-semibold text-emerald-200' : 'font-semibold text-red-300'}
                    >
                      {balance >= 0 ? '+' : ''}
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Suggested settlements
          </h3>
          {summary.settlements.length > 0 ? (
            <div className="space-y-3">
              {summary.settlements.map((settlement, index) => (
                <motion.div
                  layout
                  key={`${settlement.from.id}-${settlement.to.id}-${index}`}
                  className="flex flex-col rounded-2xl border border-white/5 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{settlement.from.emoji ?? '💸'}</span>
                    <p>
                      <span className="font-semibold text-white">{settlement.from.name}</span> should pay{' '}
                      <span className="font-semibold text-emerald-200">{formatCurrency(settlement.amount)}</span>{' '}
                      to <span className="font-semibold text-white">{settlement.to.name}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p layout className="text-sm text-slate-400">
              Balances are even. Great job team! 🎉
            </motion.p>
          )}
        </div>
      </div>
    </SectionCard>
  );
};

export default SummaryPanel;
