import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import logger from "../logger";

import { RequestWithUser } from "../types/express";

const validate = (schema: AnyZodObject) => {
  return (
    req: Request | RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
      });

      return next();
    } catch (err: any) {
      logger.error({
        status: 400,
        name: "Bad Request",
        errors: err.errors,
      });
      return res.status(400).send(err.errors);
    }
  };
};

export default validate;
