import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateJWT = (userId: string, res: Response) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token
};
