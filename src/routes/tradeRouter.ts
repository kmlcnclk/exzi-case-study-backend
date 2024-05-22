import express, { Router } from "express";
import { checkJwtAndUserExist } from "../middlewares/Jwt";
import TradeController from "../controllers/tradeController";
import UserDAO from "../data/UserDAO";

class TradeRouter {
  tradeRouter: Router;
  tradeController: TradeController;

  constructor() {
    this.tradeController = new TradeController();
    this.tradeRouter = express.Router();
    this.routes();
  }
// burada galiba ethereum ve bitcoin alım satımı yapılıyor
  routes() {
    this.buy();
    this.sell();
    this.history();
  }

  buy() {
    this.tradeRouter.post(
      "/buy",
      [checkJwtAndUserExist(UserDAO)],
      this.tradeController.buy
    );
  }

  sell() {
    this.tradeRouter.post(
      "/sell",
      [checkJwtAndUserExist(UserDAO)],
      this.tradeController.sell
    );
  }

  history() {
    this.tradeRouter.post(
      "/history",
      [checkJwtAndUserExist(UserDAO)],
      this.tradeController.history
    );
  }
}

export default TradeRouter;
