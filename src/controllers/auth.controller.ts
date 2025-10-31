import { Request, Response, NextFunction } from "express";
import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService,
} from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const user = await registerService(name, email, password);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.cookie('accessToken', data.accessToken, { httpOnly: true,secure:true,sameSite: 'none',maxAge: 3600000 });
    res.cookie('refreshToken',data.refreshToken, { httpOnly: true,secure:true,sameSite: 'none',maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const data = await refreshTokenService(refreshToken);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await logoutService(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
