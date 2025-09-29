import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/money';

const TransferManager = () => {
  const { participants, transfers, addTransfer, updateTransfer, removeTransfer } = useFinanceStore();
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [draftAmount, setDraftAmount] = useState('');
  const [draftReason, setDraftReason] = useState('');

  const participantOptions = useMemo(() => participants, [participants]);

  const resetForm = () => {
    setFromId('');
    setToId('');
    setAmount('');
    setReason('');
  };

  const handleSubmit = () => {
    const numericAmount = Number.parseFloat(amount);
    if (!fromId || !toId || fromId === toId || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    addTransfer({
      fromId,
      toId,
      amount: Number(numericAmount.toFixed(2)),
      reason: reason.trim() || undefined,
    });
    resetForm();
  };

  const startEditing = (transferId: string) => {
    const transfer = transfers.find((entry) => entry.id === transferId);
    if (!transfer) {
      return;
    }
    setEditingId(transfer.id);
    setDraftFrom(transfer.fromId);
    setDraftTo(transfer.toId);
    setDraftAmount(String(transfer.amount));
    setDraftReason(transfer.reason ?? '');
  };

  const saveEditing = () => {
    if (!editingId) {
      return;
    }
    const numericAmount = Number.parseFloat(draftAmount);
    if (!draftFrom || !draftTo || draftFrom === draftTo || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }
    updateTransfer(editingId, {
      fromId: draftFrom,
      toId: draftTo,
      amount: Number(numericAmount.toFixed(2)),
      reason: draftReason.trim() || undefined,
    });
    setEditingId(null);
  };

  const cancelEditing = () => setEditingId(null);

  return (
    <SectionCard
      title="Transfers"
      description="Record manual paybacks or adjustments between participants."
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,0.5fr)]">
        <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">From</label>
              <select
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white focus:outline-none"
                value={fromId}
                onChange={(event) => setFromId(event.target.value)}
              >
                <option value="">Select sender</option>
                {participantOptions.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.emoji ? `${participant.emoji} ` : ''}
                    {participant.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">To</label>
              <select
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white focus:outline-none"
                value={toId}
                onChange={(event) => setToId(event.target.value)}
              >
                <option value="">Select recipient</option>
                {participantOptions.map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.emoji ? `${participant.emoji} ` : ''}
                    {participant.name}
                  </option>
                ))}
              </select>
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reason (optional)</label>
              <input
                className="rounded-xl bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                placeholder="Payback for groceries"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !fromId ||
            !toId ||
            fromId === toId ||
            !amount.trim() ||
            Number.parseFloat(amount) <= 0
          }
          className="rounded-2xl bg-gradient-to-r from-ocean-400 via-blossom-500 to-ocean-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/40 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add transfer
        </button>
      </div>

      <AnimatePresence initial={false}>
        {transfers.length > 0 ? (
          <div className="space-y-3">
            {transfers.map((transfer) => {
              const fromParticipant = participants.find((participant) => participant.id === transfer.fromId);
              const toParticipant = participants.find((participant) => participant.id === transfer.toId);
              const isEditing = editingId === transfer.id;
              return (
                <motion.div
                  layout
                  key={transfer.id}
                  initial={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, translateY: -12 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-white/5 bg-slate-800/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      {isEditing ? (
                        <div className="grid gap-2 sm:grid-cols-2 sm:items-center">
                          <select
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftFrom}
                            onChange={(event) => setDraftFrom(event.target.value)}
                          >
                            <option value="">Select sender</option>
                            {participants.map((participant) => (
                              <option key={participant.id} value={participant.id}>
                                {participant.emoji ? `${participant.emoji} ` : ''}
                                {participant.name}
                              </option>
                            ))}
                          </select>
                          <select
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftTo}
                            onChange={(event) => setDraftTo(event.target.value)}
                          >
                            <option value="">Select recipient</option>
                            {participants.map((participant) => (
                              <option key={participant.id} value={participant.id}>
                                {participant.emoji ? `${participant.emoji} ` : ''}
                                {participant.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            value={draftAmount}
                            onChange={(event) => setDraftAmount(event.target.value)}
                          />
                          <input
                            className="rounded-xl bg-slate-900/80 px-3 py-2 text-sm text-white focus:outline-none"
                            placeholder="Reason"
                            value={draftReason}
                            onChange={(event) => setDraftReason(event.target.value)}
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            {fromParticipant ? fromParticipant.name : 'Someone'} →{' '}
                            {toParticipant ? toParticipant.name : 'Someone'}
                          </h3>
                          {transfer.reason ? (
                            <p className="text-sm text-slate-300">{transfer.reason}</p>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-emerald-200">
                        {formatCurrency(transfer.amount)}
                      </span>
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEditing}
                            className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
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
                            onClick={() => startEditing(transfer.id)}
                            className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeTransfer(transfer.id)}
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
            No transfers yet. Use this to reflect manual adjustments.
          </motion.p>
        )}
      </AnimatePresence>
    </SectionCard>
  );
};

export default TransferManager;
