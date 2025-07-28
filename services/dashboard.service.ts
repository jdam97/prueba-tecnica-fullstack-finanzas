import { prisma } from "@/lib/auth/prisma";

export async function getDashboardSummaryService(id?: string) {
  const [income, expense, incomeCount, expenseCount, userCount] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: { ...(id ? { id } : {}), type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...(id ? { id } : {}), type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { ...(id ? { id } : {}), type: "INCOME" },
      }),
      prisma.transaction.count({
        where: { ...(id ? { id } : {}), type: "EXPENSE" },
      }),
      prisma.user.count(),
    ]);

  const totalIncome = income._sum.amount || 0;
  const totalExpense = expense._sum.amount || 0;
  const totalTransactions = incomeCount + expenseCount;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    incomeCount,
    expenseCount,
    totalTransactions,
    totalUsers: id ? undefined : userCount,
  };
}

export async function getRecentTransactionsService(id?: string) {
  return await prisma.transaction.findMany({
    where: id ? { id } : {},
    orderBy: { date: "desc" },
    take: 4,
    select: {
      id: true,
      concept: true,
      amount: true,
      date: true,
      type: true,
      user: { select: { name: true } },
    },
  });
}
