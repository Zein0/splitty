import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/money';

const IncomeManager = () => {
  const { participants, incomes, addIncome, updateIncome, removeIncome } = useFinanceStore();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [receiverId, setReceiverId] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAmount, setDraftAmount] = useState('');
  const [draftReceiver, setDraftReceiver] = useState<string>('');

  const hasParticipants = participants.length > 0;
  const receiverOptions = useMemo(() => participants, [participants]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setReceiverId('');
  };

  const handleSubmit = () => {
    const numericAmount = Number.parseFloat(amount);
    if (!title.trim() || !receiverId || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    addIncome({
      title: title.trim(),
      amount: Number(numericAmount.toFixed(2)),
      receiverId,
    });
    resetForm();
  };

  const startEditing = (id: string, currentTitle: string, currentAmount: number, currentReceiver: string) => {
    setEditingId(id);
    setDraftTitle(currentTitle);
    setDraftAmount(String(currentAmount));
    setDraftReceiver(currentReceiver);
  };

  const saveEditing = () => {
    if (!editingId) {
      return;
    }
    const numericAmount = Number.parseFloat(draftAmount);
    if (!draftTitle.trim() || !draftReceiver || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    updateIncome(editingId, {
      title: draftTitle.trim(),
      amount: Number(numericAmount.toFixed(2)),
      receiverId: draftReceiver,
    });
    setEditingId(null);
  };

  const cancelEditing = () => setEditingId(null);

  return (
    <SectionCard
      title="Income"
      description="Track any money coming into the group. Splitly+ will redistribute it evenly so everyone gets their fair share."
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,0.5fr)]">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Title</label>
              <input
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                placeholder="Refund, voucher..."
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
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Received by</label>
              <select
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white focus:outline-none"
                value={receiverId}
                onChange={(event) => setReceiverId(event.target.value)}
              >
                <option value="">Select a participant</option>
                {receiverOptions.map((participant) => (
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
            !receiverId ||
            !title.trim() ||
            !amount.trim() ||
            Number.parseFloat(amount) <= 0
          }
          className="rounded-2xl bg-gradient-to-r from-blossom-500 via-ocean-400 to-blossom-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blossom-900/30 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blossom-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add income
        </button>
      </div>

      <AnimatePresence initial={false}>
        {incomes.length > 0 ? (
          <div className="space-y-3">
            {incomes.map((income) => {
              const receiver = participants.find((participant) => participant.id === income.receiverId);
              const isEditing = editingId === income.id;
              return (
                <motion.div
                  layout
                  key={income.id}
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
                            value={draftReceiver}
                            onChange={(event) => setDraftReceiver(event.target.value)}
                          >
                            <option value="">Select receiver</option>
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
                          <h3 className="text-base font-semibold text-white">{income.title}</h3>
                          <p className="text-sm text-slate-300">
                            {receiver ? `Received by ${receiver.name}` : 'Receiver removed'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-blossom-200">
                        {formatCurrency(income.amount)}
                      </span>
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="rounded-xl bg-blossom-500/20 px-3 py-1 text-xs font-semibold text-blossom-100 transition hover:bg-blossom-500/30"
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
                              startEditing(income.id, income.title, income.amount, income.receiverId)
                            }
                            className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeIncome(income.id)}
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
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-400">
            No income entries yet. Record reimbursements or payouts here.
          </motion.p>
        )}
      </AnimatePresence>
    </SectionCard>
  );
};

export default IncomeManager;
