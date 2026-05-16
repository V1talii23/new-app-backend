import { NextFunction, Request, Response } from "express";
import {HttpError} from "http-errors";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.error("Error:", err);
    
    if (err instanceof HttpError) {
        return res.status(err.status).json({message: err.message ||err.name})
    }

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    error: "Internal server error",
    message: isProd ? "Ooops Something went wrong" : err.message,
  });
}
