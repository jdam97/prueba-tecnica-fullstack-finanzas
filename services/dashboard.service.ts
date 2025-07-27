import { prisma } from "@/lib/auth/prisma";

export async function getDashboardSummaryService(userId?: string) {
  const [income, expense, incomeCount, expenseCount, userCount] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: { ...(userId ? { userId } : {}), type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...(userId ? { userId } : {}), type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.transaction.count({
        where: { ...(userId ? { userId } : {}), type: "INCOME" },
      }),
      prisma.transaction.count({
        where: { ...(userId ? { userId } : {}), type: "EXPENSE" },
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
    totalUsers: userId ? undefined : userCount,
  };
}

export async function getRecentTransactionsService(userId?: string) {
  return await prisma.transaction.findMany({
    where: userId ? { userId } : {},
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
