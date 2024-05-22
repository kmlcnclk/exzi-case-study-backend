import { Response, Request } from "express";

import { SignInType, SignUpType } from "../types/User";
import { IGeneratedJwtTokens } from "../types/Jwt";
import { omit, get } from "lodash";
import logger from "../logger";
import UserService from "../services/User/UserService";
import { UserDocument } from "../models/userModel";
import { RequestWithUser } from "../types/express";

class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const userData: SignUpType = req.body;

      const data = {
        ...omit(userData, "passwordConfirmation"),
      };

      const user: UserDocument = await this.userService.createUser(data);

      const { accessToken, refreshToken }: IGeneratedJwtTokens =
        await this.userService.generateJwtToken(user);

      this.userService.createJWTToken(
        user._id as unknown as string,
        accessToken,
        refreshToken
      );

      logger.info("Sign up is successful");

      return res.status(201).json({
        accessToken,
        refreshToken,
      });
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const signInData: SignInType = req.body;

      const validated = await this.userService.isValidatePassword(signInData);

      await this.userService.updateJwtValidWithFalseOnDb(
        get(validated, "_id") as unknown as string
      );

      const generatedTokensData =
        await this.userService.generateWithIdAndSaveDbJwtToken(validated);

      logger.info("Login is successful");

      return res.status(200).json({
        ...generatedTokensData,
      });
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

  getUserById = async (req: RequestWithUser, res: Response) => {
    try {
      const user = await this.userService.findUserByIDWithSelect(
        get(req.user, "_id") as unknown as string
      );

      logger.info("User successfully found");

      return res.status(200).json({
        user: user,
      });
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
}

export default UserController;
