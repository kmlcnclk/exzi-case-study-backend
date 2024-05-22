import { get } from "lodash";
import UserDAO from "../../data/UserDAO";
import { verifyJwt } from "../../lib/jwt";
import { NextFunction, Response } from "express";
import logger from "../../logger";
import CustomError from "../../helpers/errors/CustomError";
import { RequestWithUser } from "../../types/express";
import { ISignJwt } from "../../types/Jwt";

const checkUserExist = async <T extends typeof UserDAO>(
  userId: string | undefined,
  dao: T
): Promise<boolean> => {
  try {
    const where = { _id: userId };
    const data = await dao.exist(where);
    if (data) return true;
    return false;
  } catch (err: any) {
    // TODO: log
    throw new CustomError(err.name, err.message, err.status);
  }
};

export const checkJwtAndUserExist = <T extends typeof UserDAO>(dao: T) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
      );
      if (accessToken) {
        const { decoded, expired } = verifyJwt(
          accessToken,
          "ACCESS_TOKEN_PRIVATE_KEY"
        );

        if (expired)
          throw new CustomError("Bad Request", "JWT Token Expired", 400);

        const userId = get(decoded, "_id");
        if (userId) {
          const user = await checkUserExist<T>(userId, dao);
          if (user) {
            req.user = decoded as ISignJwt;

            return next();
          } else throw new CustomError("Not Found", "User Not Found", 404);
        } else throw new CustomError("Not Found", "User Not Found", 404);
      } else throw new CustomError("Bad Request", "JWT Token Not Found", 400);
    } catch (err: any) {
      if (err.status) {
        logger.error({
          status: err.status,
          name: err.name,
          message: err.message,
        });

        return res.status(err.status).json({
          error: {
            name: err.name,
            message: err.message,
          },
        });
      }

      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });

      return res.status(500).json({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    }
  };
};
