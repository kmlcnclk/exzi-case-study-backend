import express, { Router } from "express";
import { checkJwtAndUserExist } from "../middlewares/Jwt";
import TradeController from "../controllers/tradeController";
import UserDAO from "../data/UserDAO";
import validate from "../middlewares/validateResource";
import { buyTradeSchema } from "../schemas/tradeSchema";

class TradeRouter {
  tradeRouter: Router;
  tradeController: TradeController;

  constructor() {
    this.tradeController = new TradeController();
    this.tradeRouter = express.Router();
    this.routes();
  }

  routes() {
    this.buy();
    this.sell();
    this.history();
  }

  buy() {
    this.tradeRouter.post(
      "/buy",
      [validate(buyTradeSchema), checkJwtAndUserExist(UserDAO)],
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
    this.tradeRouter.get(
      "/history",
      [checkJwtAndUserExist(UserDAO)],
      this.tradeController.history
    );
  }
}

export default TradeRouter;
