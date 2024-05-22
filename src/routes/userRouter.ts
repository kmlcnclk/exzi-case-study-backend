import express, { Router } from "express";
import { isUserEmailExists } from "../middlewares/User";
import { createUserSchema, signInSchema } from "../schemas/userSchema";
import validate from "../middlewares/validateResource";
import UserController from "../controllers/userController";
import { checkJwtAndUserExist } from "../middlewares/Jwt";
import UserDAO from "../data/UserDAO";

class UserRouter {
  userController: UserController;
  userRouter: Router;

  constructor() {
    this.userController = new UserController();
    this.userRouter = express.Router();

    this.routes();
  }

  routes() {
    this.signUp();
    this.signIn();
    this.getUserById();
  }

  signUp() {
    this.userRouter.post(
      "/sign-up",
      [validate(createUserSchema), isUserEmailExists],
      this.userController.signUp
    );
  }

  signIn() {
    this.userRouter.post(
      "/sign-in",
      [validate(signInSchema)],
      this.userController.signIn
    );
  }

  getUserById() {
    this.userRouter.get(
      "/getUserById",
      [checkJwtAndUserExist(UserDAO)],
      this.userController.getUserById
    );
  }
}

export default UserRouter;
