import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
