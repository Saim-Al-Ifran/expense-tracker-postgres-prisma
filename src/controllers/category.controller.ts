import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id as number; // populated by auth middleware

    if (!name) return res.status(400).json({ message: "Name is required." });

    const category = await categoryService.createCategory(userId, name);
    res.status(201).json({ success: true, category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as number;
    const categories = await categoryService.getAllCategories(userId);
    res.status(200).json({ success: true, categories });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.id as number;

    const category = await categoryService.updateCategory(
      parseInt(id),
      userId,
      name
    );
    res.status(200).json({ success: true, category });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id as number;

    const result = await categoryService.deleteCategory(parseInt(id), userId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
