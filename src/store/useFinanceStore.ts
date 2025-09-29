import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UUID = string;

export type Participant = {
  id: UUID;
  name: string;
  emoji?: string;
  color: string;
};

export type Expense = {
  id: UUID;
  title: string;
  amount: number;
  payerId: UUID;
  createdAt: string;
};

export type Income = {
  id: UUID;
  title: string;
  amount: number;
  receiverId: UUID;
  createdAt: string;
};

export type Transfer = {
  id: UUID;
  fromId: UUID;
  toId: UUID;
  amount: number;
  reason?: string;
  createdAt: string;
};

export type FinanceState = {
  participants: Participant[];
  expenses: Expense[];
  incomes: Income[];
  transfers: Transfer[];
  addParticipant: (name: string, emoji?: string) => void;
  updateParticipant: (id: UUID, updates: Partial<Omit<Participant, 'id'>>) => void;
  removeParticipant: (id: UUID) => void;
  addExpense: (input: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: UUID, updates: Partial<Omit<Expense, 'id'>>) => void;
  removeExpense: (id: UUID) => void;
  addIncome: (input: Omit<Income, 'id' | 'createdAt'>) => void;
  updateIncome: (id: UUID, updates: Partial<Omit<Income, 'id'>>) => void;
  removeIncome: (id: UUID) => void;
  addTransfer: (input: Omit<Transfer, 'id' | 'createdAt'>) => void;
  updateTransfer: (id: UUID, updates: Partial<Omit<Transfer, 'id'>>) => void;
  removeTransfer: (id: UUID) => void;
  resetAll: () => void;
};

const participantPalette = ['#38bdf8', '#ec4899', '#f97316', '#22c55e', '#a855f7', '#facc15'];

const pickColor = (existing: Participant[]): string => {
  const used = new Set(existing.map((p) => p.color));
  const unused = participantPalette.find((color) => !used.has(color));
  return unused ?? participantPalette[existing.length % participantPalette.length];
};

const now = () => new Date().toISOString();

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      participants: [],
      expenses: [],
      incomes: [],
      transfers: [],
      addParticipant: (name, emoji) =>
        set((state) => ({
          participants: [
            ...state.participants,
            {
              id: createId(),
              name,
              emoji,
              color: pickColor(state.participants),
            },
          ],
        })),
      updateParticipant: (id, updates) =>
        set((state) => ({
          participants: state.participants.map((participant) =>
            participant.id === id ? { ...participant, ...updates } : participant,
          ),
        })),
      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((participant) => participant.id !== id),
          expenses: state.expenses.filter((expense) => expense.payerId !== id),
          incomes: state.incomes.filter((income) => income.receiverId !== id),
          transfers: state.transfers.filter(
            (transfer) => transfer.fromId !== id && transfer.toId !== id,
          ),
        })),
      addExpense: (input) =>
        set((state) => ({
          expenses: [
            {
              id: createId(),
              createdAt: now(),
              ...input,
            },
            ...state.expenses,
          ],
        })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updates } : expense,
          ),
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      addIncome: (input) =>
        set((state) => ({
          incomes: [
            {
              id: createId(),
              createdAt: now(),
              ...input,
            },
            ...state.incomes,
          ],
        })),
      updateIncome: (id, updates) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updates } : income,
          ),
        })),
      removeIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),
      addTransfer: (input) =>
        set((state) => ({
          transfers: [
            {
              id: createId(),
              createdAt: now(),
              ...input,
            },
            ...state.transfers,
          ],
        })),
      updateTransfer: (id, updates) =>
        set((state) => ({
          transfers: state.transfers.map((transfer) =>
            transfer.id === id ? { ...transfer, ...updates } : transfer,
          ),
        })),
      removeTransfer: (id) =>
        set((state) => ({
          transfers: state.transfers.filter((transfer) => transfer.id !== id),
        })),
      resetAll: () =>
        set({
          participants: [],
          expenses: [],
          incomes: [],
          transfers: [],
        }),
    }),
    {
      name: 'splitly-plus-storage',
      version: 1,
    },
  ),
);

export type { Expense as ExpenseEntry, Income as IncomeEntry, Transfer as TransferEntry };
