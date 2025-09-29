import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore } from '../store/useFinanceStore';
import SectionCard from './SectionCard';

const ParticipantManager = () => {
  const { participants, addParticipant, updateParticipant, removeParticipant } =
    useFinanceStore();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftEmoji, setDraftEmoji] = useState('');

  const resetForm = () => {
    setName('');
    setEmoji('');
  };

  const handleAdd = () => {
    if (!name.trim()) {
      return;
    }
    addParticipant(name.trim(), emoji.trim() || undefined);
    resetForm();
  };

  const startEditing = (id: string, currentName: string, currentEmoji?: string) => {
    setEditingId(id);
    setDraftName(currentName);
    setDraftEmoji(currentEmoji ?? '');
  };

  const saveEditing = () => {
    if (!editingId || !draftName.trim()) {
      return;
    }
    updateParticipant(editingId, { name: draftName.trim(), emoji: draftEmoji.trim() || undefined });
    setEditingId(null);
    setDraftEmoji('');
    setDraftName('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftEmoji('');
    setDraftName('');
  };

  return (
    <SectionCard
      title="Participants"
      description="Add everyone involved. You can personalise each profile with an emoji to make the summary easier to skim."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5">
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            placeholder="Name (e.g. Sara)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="w-16 rounded-xl bg-slate-800/60 px-3 py-2 text-center text-lg focus:outline-none"
            placeholder="🙂"
            value={emoji}
            onChange={(event) => setEmoji(event.target.value)}
            maxLength={4}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="group flex items-center justify-center rounded-2xl bg-gradient-to-r from-ocean-500 via-blossom-500 to-ocean-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-900/30 transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300"
        >
          Add person
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid gap-3 sm:grid-cols-2">
          {participants.map((participant) => {
            const isEditing = editingId === participant.id;
            return (
              <motion.div
                layout
                key={participant.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-white/5 bg-slate-800/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl text-2xl"
                      style={{ background: `${participant.color}1f`, color: participant.color }}
                    >
                      {participant.emoji ?? '👤'}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-white">
                        {isEditing ? (
                          <input
                            className="rounded-xl bg-slate-900/80 px-3 py-1 text-sm text-white focus:outline-none"
                            value={draftName}
                            onChange={(event) => setDraftName(event.target.value)}
                          />
                        ) : (
                          participant.name
                        )}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Participant</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={saveEditing}
                          className="rounded-xl bg-ocean-500/20 px-3 py-1 text-xs font-semibold text-ocean-200 transition hover:bg-ocean-500/30"
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
                          onClick={() => startEditing(participant.id, participant.name, participant.emoji)}
                          className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeParticipant(participant.id)}
                          className="rounded-xl bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="mt-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Emoji
                    </label>
                    <input
                      className="mt-1 w-20 rounded-xl bg-slate-900/80 px-3 py-1 text-center text-lg focus:outline-none"
                      value={draftEmoji}
                      onChange={(event) => setDraftEmoji(event.target.value)}
                      maxLength={4}
                    />
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </SectionCard>
  );
};

export default ParticipantManager;
