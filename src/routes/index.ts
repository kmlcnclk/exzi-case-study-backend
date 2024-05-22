import express, { Router } from "express";
import UserRouter from "./userRouter";
import WalletRouter from "./walletRouter";
import JwtRouter from "./jwtRouter";
import TradeRouter from "./tradeRouter";

class MainRouter {
  mainRouter: Router;
  userRouter: UserRouter;
  walletRouter: WalletRouter;
  jwtRouter: JwtRouter;
  tradeRouter: TradeRouter;

  constructor() {
    this.mainRouter = express.Router();
    this.userRouter = new UserRouter();
    this.walletRouter = new WalletRouter();
    this.jwtRouter = new JwtRouter();
    this.tradeRouter = new TradeRouter();

    this.use();
  }

  use() {
    this.mainRouter.use("/user", this.userRouter.userRouter);
    this.mainRouter.use("/jwt", this.jwtRouter.jwtRouter);
    this.mainRouter.use("/wallet", this.walletRouter.walletRouter);
    this.mainRouter.use("/trade", this.tradeRouter.tradeRouter);
  }
}

export default new MainRouter();
