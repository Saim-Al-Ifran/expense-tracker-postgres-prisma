import prisma from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { CustomError } from "../utils/customError";

export async function registerService(name: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new CustomError("Email already exists", 400);

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function loginService(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new CustomError("Invalid credentials", 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new CustomError("Invalid credentials", 401);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function refreshTokenService(oldToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } });
  if (!stored) throw new CustomError("Invalid refresh token", 403);

  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: oldToken } });
    throw new CustomError("Refresh token expired", 403);
  }

  const accessToken = generateAccessToken(stored.userId);
  return { accessToken };
}

export async function logoutService(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
  return { message: "Logged out successfully" };
}
