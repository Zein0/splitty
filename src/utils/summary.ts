import type {
  Expense,
  Income,
  Participant,
  Transfer,
} from '../store/useFinanceStore';
import { fromCents, toCents } from './money';

export type PersonBreakdown = {
  participant: Participant;
  balance: number;
  spent: number;
  received: number;
};

export type Settlement = {
  from: Participant;
  to: Participant;
  amount: number;
};

export type FinanceSummary = {
  breakdown: PersonBreakdown[];
  settlements: Settlement[];
  totalExpenses: number;
  totalIncomes: number;
};

const calculateExpenseEffects = (
  expense: Expense,
  participants: Participant[],
  ledger: Map<string, { balance: number; spent: number; received: number }>,
) => {
  if (participants.length === 0) {
    return;
  }
  const cents = toCents(expense.amount);
  const baseShare = Math.floor(cents / participants.length);
  let remainder = cents - baseShare * participants.length;

  participants.forEach((participant) => {
    const entry = ledger.get(participant.id)!;
    const adjustment = remainder > 0 ? 1 : 0;
    entry.balance -= baseShare + adjustment;
    if (remainder > 0) {
      remainder -= 1;
    }
  });
  const payerEntry = ledger.get(expense.payerId);
  if (payerEntry) {
    payerEntry.balance += cents;
    payerEntry.spent += cents;
  }
};

const calculateIncomeEffects = (
  income: Income,
  participants: Participant[],
  ledger: Map<string, { balance: number; spent: number; received: number }>,
) => {
  if (participants.length === 0) {
    return;
  }
  const cents = toCents(income.amount);
  const baseShare = Math.floor(cents / participants.length);
  let remainder = cents - baseShare * participants.length;

  participants.forEach((participant) => {
    const entry = ledger.get(participant.id)!;
    const adjustment = remainder > 0 ? 1 : 0;
    entry.balance += baseShare + adjustment;
    entry.received += baseShare + adjustment;
    if (remainder > 0) {
      remainder -= 1;
    }
  });
  const receiverEntry = ledger.get(income.receiverId);
  if (receiverEntry) {
    receiverEntry.balance -= cents;
  }
};

const calculateTransferEffects = (
  transfer: Transfer,
  ledger: Map<string, { balance: number; spent: number; received: number }>,
) => {
  const fromEntry = ledger.get(transfer.fromId);
  const toEntry = ledger.get(transfer.toId);
  const cents = toCents(transfer.amount);
  if (fromEntry) {
    fromEntry.balance += cents;
  }
  if (toEntry) {
    toEntry.balance -= cents;
  }
};

const settleBalances = (
  participants: Participant[],
  ledger: Map<string, { balance: number; spent: number; received: number }>,
): Settlement[] => {
  const positives: { participant: Participant; amount: number }[] = [];
  const negatives: { participant: Participant; amount: number }[] = [];

  participants.forEach((participant) => {
    const balance = ledger.get(participant.id)?.balance ?? 0;
    if (balance > 0) {
      positives.push({ participant, amount: balance });
    } else if (balance < 0) {
      negatives.push({ participant, amount: Math.abs(balance) });
    }
  });

  positives.sort((a, b) => b.amount - a.amount);
  negatives.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let i = 0;
  let j = 0;

  while (i < negatives.length && j < positives.length) {
    const debtor = negatives[i];
    const creditor = positives[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      settlements.push({
        from: debtor.participant,
        to: creditor.participant,
        amount: fromCents(amount),
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) {
      i += 1;
    }
    if (creditor.amount === 0) {
      j += 1;
    }
  }

  return settlements;
};

export const buildFinanceSummary = (
  participants: Participant[],
  expenses: Expense[],
  incomes: Income[],
  transfers: Transfer[],
): FinanceSummary => {
  const ledger = new Map<string, { balance: number; spent: number; received: number }>();

  participants.forEach((participant) => {
    ledger.set(participant.id, { balance: 0, spent: 0, received: 0 });
  });

  expenses.forEach((expense) => {
    calculateExpenseEffects(expense, participants, ledger);
  });

  incomes.forEach((income) => {
    calculateIncomeEffects(income, participants, ledger);
  });

  transfers.forEach((transfer) => {
    calculateTransferEffects(transfer, ledger);
  });

  const breakdown: PersonBreakdown[] = participants.map((participant) => {
    const entry = ledger.get(participant.id)!;
    return {
      participant,
      balance: fromCents(entry.balance),
      spent: fromCents(entry.spent),
      received: fromCents(entry.received),
    };
  });

  const settlements = settleBalances(participants, ledger);

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  const totalIncomes = incomes.reduce((acc, income) => acc + income.amount, 0);

  return {
    breakdown,
    settlements,
    totalExpenses,
    totalIncomes,
  };
};
