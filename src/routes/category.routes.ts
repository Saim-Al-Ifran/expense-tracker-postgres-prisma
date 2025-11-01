import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import authenticate from "../middlewares/auth";
 

const router = express.Router();

router.post("/", authenticate, createCategory);
router.get("/", authenticate, getCategories);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
