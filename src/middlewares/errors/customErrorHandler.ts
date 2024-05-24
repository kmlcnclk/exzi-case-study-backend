import { NextFunction, Request, Response } from "express";
import CustomError from "../../helpers/errors/CustomError";

// Custom error handler
const customErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;

  if (err?.name === "SyntaxError") {
    customError = new CustomError("Bad Request", "Unexpected Syntax", 400);
  }

  if (err?.name === "ValidationError") {
    customError = new CustomError("Bad Request", err.message, 400);
  }
  if (err?.name === "CastError") {
    customError = new CustomError(
      "Bad Request",
      "Please provide a valid id",
      400
    );
  }
  if (err?.code === 11000) {
    customError = new CustomError(
      "Bad Request",
      "Duplicate Key Found : Check Your Input",
      400
    );
  }
  if (err?.name === "TypeError") {
    customError = new CustomError(
      "Bad Request",
      " Type Error : Please Check Your Input",
      400
    );
  }

  return res.status(customError?.status || 500).json({
    success: false,
    message: customError?.message || err?.message,
  });
};

export default customErrorHandler;
