import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from "../config/prisma";
import { CustomError } from '../utils/customError';
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.ACCESS_TOKEN_SECRET!;

interface DecodedToken {
  userId: number;
}

const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.accessToken || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
      return next(new CustomError('Unauthorized', 403));
    }

    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new CustomError('Unauthorized', 401));
    }

    req.user = user;
    next();

  } catch (err: any) {
    console.error("JWT Auth Error:", err);
    if (err.name === 'TokenExpiredError') {
      return next(new CustomError('Token expired', 401));
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'SyntaxError') {
      return next(new CustomError('Invalid token', 401));
    }
    next(new CustomError('Authentication server problem', 500));
  }
};

export default authenticate;
