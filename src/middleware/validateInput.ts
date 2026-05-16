import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

type Source = "body"|"params"|"query"

export default function validate(schema: z.ZodObject, source:Source = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formatted = result.error.format();

      const errors = Object.values(formatted)
        .flat()
        .filter(
          (err): err is z.ZodFormattedError<unknown, string> =>
            typeof err === "object" && err !== null,
        )
        .map((err) => err?._errors)
        .flat();

      console.log("ERORRS:",errors);
      throw createHttpError(400, errors.join(" ") || "Invalid request data");
    }
    req[source] =result.data
    next();
  };
}



