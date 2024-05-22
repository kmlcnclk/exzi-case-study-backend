import UserDAO from "../../data/UserDAO";
import logger from "../../logger";
import { SignUpType } from "../../types/User";
import { get } from "lodash";
import { Response, Request, NextFunction } from "express";
import { RequestWithUser } from "../../types/express";

export const isUserEmailExists = async (
  req: Request | RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: SignUpType = req.body;

    const isUserEmailExist = await UserDAO.findOne({
      email: userData.email,
    });

    if (get(req, "user") && isUserEmailExist?._id == get(req, "user._id")) {
      logger.error({
        status: 400,
        name: "Bad Request",
        message: "You already have this email",
      });
      return res.status(400).json({
        message: "You already have this email",
      });
    }

    if (isUserEmailExist) {
      logger.error({
        status: 400,
        name: "Bad Request",
        message: "Email is already exist",
      });
      return res.status(400).json({
        message: "Email is already exist",
      });
    }

    return next();
  } catch (err: any) {
    logger.error({
      status: 400,
      name: "Bad Request",
      message: err.message,
    });
    return res.status(400).json({ error: err.message });
  }
};
