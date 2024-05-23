import express, { Router } from "express";
import WalletController from "../controllers/walletController";
import { checkJwtAndUserExist } from "../middlewares/Jwt";
import UserDAO from "../data/UserDAO";
import validate from "../middlewares/validateResource";
import { withdrawWalletSchema } from "../schemas/walletSchema";

class WalletRouter {
  walletRouter: Router;
  walletController: WalletController;

  constructor() {
    this.walletController = new WalletController();
    this.walletRouter = express.Router();
    this.routes();
  }

  routes() {
    this.getWalletByUserId();
    this.createWallet();
    this.withdraw();
    this.balance();
  }

  getWalletByUserId() {
    this.walletRouter.get(
      "/getWalletByUserId",
      [checkJwtAndUserExist(UserDAO)],
      this.walletController.getWalletByUserId
    );
  }

  createWallet() {
    this.walletRouter.post(
      "/create-wallet",
      [checkJwtAndUserExist(UserDAO)],
      this.walletController.createWallet
    );
  }

  withdraw() {
    this.walletRouter.post(
      "/withdraw",
      [validate(withdrawWalletSchema), checkJwtAndUserExist(UserDAO)],
      this.walletController.withdraw
    );
  }

  balance() {
    this.walletRouter.get(
      "/balance",
      [checkJwtAndUserExist(UserDAO)],
      this.walletController.balance
    );
  }
}

export default WalletRouter;
