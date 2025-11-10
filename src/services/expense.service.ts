import prisma from '../config/prisma';
import { CustomError } from '../utils/customError';

interface ExpenseInput {
  userId: number;
  categoryId: number;
  amount: number;
  description?: string;
  spentAt: Date;
}

export const createExpenseService = async (data: ExpenseInput) => {
  return await prisma.expense.create({ data });
};

export const getExpensesService = async (userId: number, filters: any, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const where: any = { userId };

  if (filters.category) where.categoryId = Number(filters.category);
  if (filters.startDate || filters.endDate) where.spentAt = {};
  if (filters.startDate) where.spentAt.gte = new Date(filters.startDate);
  if (filters.endDate) where.spentAt.lte = new Date(filters.endDate);

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      skip,
      take: limit,
      include: { user: true, category: true },
      orderBy: { spentAt: 'desc' },
    }),
    prisma.expense.count({ where }),
  ]);

  return { expenses, total };
};

export const getExpenseByIdService = async (id: number, userId: number) => {
  const expense = await prisma.expense.findUnique({
    where: { id },
    include: { user: true, category: true },
  });

  if (!expense || expense.userId !== userId) throw new CustomError('Expense not found', 404);

  return expense;
};

export const updateExpenseService = async (id: number, userId: number, data: Partial<ExpenseInput>) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense || expense.userId !== userId) throw new CustomError('Expense not found', 404);

  return await prisma.expense.update({
    where: { id },
    data: { ...data, spentAt: data.spentAt ? new Date(data.spentAt) : undefined },
  });
};

export const deleteExpenseService = async (id: number, userId: number) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense || expense.userId !== userId) throw new CustomError('Expense not found', 404);

  await prisma.expense.delete({ where: { id } });
  return { message: 'Expense deleted successfully' };
};
