import { Response, Request } from "express";
import { prisma } from "../lib/prisma.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/generateJWT.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

interface payloadType extends JwtPayload {
  email: string;
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createHttpError(401, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: { id: true, email: true, createdAt: true },
  });

  const token = generateJWT(user.id, res);

  res.status(201).json({
    status: "success",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createHttpError(409, "Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError(409, "Invalid credentials");
  }

  const token = generateJWT(user.id, res);

  res.status(200).json({
    response: "success",
    user,
    token,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { expires: new Date(0), httpOnly: true });

  res.status(200).json({ status: "success", message: "See ya!" });
};

export const requestResetEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  console.log("BODY:", req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res
      .status(200)
      .json({ message: "If this email exists, a reset link has been sent" });
  }

  const payload = { email, id: user!.id };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  console.log(token);

  try {
    await sendEmail(email, token);
  } catch (error) {
    throw createHttpError(
      500,
      error || "Failed to send the email, please try again later.",
    );
  }
  res.status(200).json({
    message: "If this email exists, a reset link has been sent",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  let payload: payloadType;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as payloadType;
  } catch {
    throw createHttpError(400, "Token is invalid or expired ");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: payload.email },
    data: { password: hashedPassword },
  });

  res.status(200).json({ message: "Password updated successfully" });
};
