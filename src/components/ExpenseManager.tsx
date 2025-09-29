import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/money';

const ExpenseManager = () => {
  const { participants, expenses, addExpense, updateExpense, removeExpense } =
    useFinanceStore();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAmount, setDraftAmount] = useState('');
  const [draftPayer, setDraftPayer] = useState<string>('');

  const hasParticipants = participants.length > 0;
  const payerOptions = useMemo(() => participants, [participants]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setPayerId('');
  };

  const handleSubmit = () => {
    const numericAmount = Number.parseFloat(amount);
    if (!title.trim() || !hasParticipants || !payerId || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    addExpense({
      title: title.trim(),
      amount: Number(numericAmount.toFixed(2)),
      payerId,
    });
    resetForm();
  };

  const startEditing = (id: string, currentTitle: string, currentAmount: number, currentPayer: string) => {
    setEditingId(id);
    setDraftTitle(currentTitle);
    setDraftAmount(String(currentAmount));
    setDraftPayer(currentPayer);
  };

  const saveEditing = () => {
    if (!editingId) {
      return;
    }
    const numericAmount = Number.parseFloat(draftAmount);
    if (!draftTitle.trim() || !draftPayer || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    updateExpense(editingId, {
      title: draftTitle.trim(),
      amount: Number(numericAmount.toFixed(2)),
      payerId: draftPayer,
    });
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <SectionCard
      title="Expenses"
      description="Log what people paid for and Splitly+ will evenly split it between the current participants."
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,0.5fr)]">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
              <input
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                placeholder="Dinner, taxi..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Amount</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white focus:outline-none"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Paid by</label>
              <select
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white focus:outline-none"
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
              >
                <option value="">Select a participant</option>
                {payerOptions.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.emoji ? `${participant.emoji} ` : ''}
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !hasParticipants ||
            !payerId ||
            !title.trim() ||
            !amount.trim() ||
            Number.parseFloat(amount) <= 0
          }
          className="rounded-2xl bg-gradient-to-r from-ocean-500 via-ocean-400 to-blossom-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-900/30 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add expense
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const payer = participants.find((participant) => participant.id === expense.payerId);
              const isEditing = editingId === expense.id;
              return (
                <motion.div
                  layout
                  key={expense.id}
                  initial={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -12 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-white/5 bg-slate-800/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {isEditing ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <input
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftTitle}
                            onChange={(event) => setDraftTitle(event.target.value)}
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftAmount}
                            onChange={(event) => setDraftAmount(event.target.value)}
                          />
                          <select
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftPayer}
                            onChange={(event) => setDraftPayer(event.target.value)}
                          >
                            <option value="">Select payer</option>
                            {participants.map((participant) => (
                              <option key={participant.id} value={participant.id}>
                                {participant.emoji ? `${participant.emoji} ` : ''}
                                {participant.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-base font-semibold text-white">{expense.title}</h3>
                          <p className="text-sm text-slate-300">
                            {payer ? `Paid by ${payer.name}` : 'Payer removed'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-ocean-200">
                        {formatCurrency(expense.amount)}
                      </span>
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="rounded-xl bg-ocean-500/20 px-3 py-1 text-xs font-semibold text-ocean-100 transition hover:bg-ocean-500/30"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="rounded-xl bg-slate-700/40 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-700/60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              startEditing(expense.id, expense.title, expense.amount, expense.payerId)
                            }
                            className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExpense(expense.id)}
                            className="rounded-xl bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400"
          >
            No expenses yet. Add one above to see the magic happen ✨
          </motion.p>
        )}
      </AnimatePresence>
    </SectionCard>
  );
};

export default ExpenseManager;
