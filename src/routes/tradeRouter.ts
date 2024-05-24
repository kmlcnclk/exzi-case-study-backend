import express, { Router } from "express";
import { checkJwtAndUserExist } from "../middlewares/Jwt";
import TradeController from "../controllers/tradeController";
import UserDAO from "../data/UserDAO";
import validate from "../middlewares/validateResource";
import { buyAndSellTradeSchema } from "../schemas/tradeSchema";

class TradeRouter {
  tradeRouter: Router;
  tradeController: TradeController;

  constructor() {
    this.tradeController = new TradeController();
    this.tradeRouter = express.Router();
    this.routes();
  }

  routes() {
    this.buyAndSell();
    this.history();
  }

  buyAndSell() {
    this.tradeRouter.post(
      "/buy-and-sell",
      [validate(buyAndSellTradeSchema), checkJwtAndUserExist(UserDAO)],
      this.tradeController.buyAndSell
    );
  }

  history() {
    this.tradeRouter.get(
      "/history",
      [checkJwtAndUserExist(UserDAO)],
      this.tradeController.history
    );
  }
}

export default TradeRouter;
