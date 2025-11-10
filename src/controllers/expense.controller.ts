import { Request, Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service';

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = { ...req.body, userId: req.user!.id };
    const expense = await expenseService.createExpenseService(data);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filters = { category: req.query.category, startDate: req.query.startDate, endDate: req.query.endDate };

    const { expenses, total } = await expenseService.getExpensesService(req.user!.id, filters, page, limit);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.getExpenseByIdService(Number(req.params.id), req.user!.id);
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.updateExpenseService(Number(req.params.id), req.user!.id, req.body);
    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await expenseService.deleteExpenseService(Number(req.params.id), req.user!.id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};
