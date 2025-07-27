// services/transaction.service.ts
import { prisma } from "@/lib/auth/prisma";

type NewTransactionInput = {
  amount: number;
  concept: string;
  date: string;
  userId: string;
  type: "INCOME" | "EXPENSE";
};

//get all transactions
export async function getTransactionsService(userId?: string) {
  return await prisma.transaction.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { date: "desc" },
    select: {
      id: true,
      concept: true,
      amount: true,
      date: true,
      type: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

//create transactions
export async function createTransactionService(data: NewTransactionInput) {
  return await prisma.transaction.create({
    data,
    select: {
      id: true,
      concept: true,
      amount: true,
      date: true,
      type: true,
      userId: true,
    },
  });
}

//delete
export async function deleteTransactionService(id: string) {
  return await prisma.transaction.delete({
    where: { id },
  });
}
