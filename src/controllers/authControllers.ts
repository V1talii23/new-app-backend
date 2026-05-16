import { Response, Request } from "express";
import { prisma } from "../lib/prisma";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { generateJWT } from "../utils/generateJWT";

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
    select:{id:true, email:true, createdAt:true}
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
    
    const token = generateJWT(user.id, res)

  res.status(200).json({
    response: "success",
    user,
    token
  });
};

export const logout = async (req:Request, res:Response) => {
    res.cookie("jwt", '',{expires:new Date(0), httpOnly:true})
    
    res.status(200).json(
        {status:"success",
         message: "See ya!" })
    

}
