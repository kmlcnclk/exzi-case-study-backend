import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types/express";
import logger from "../logger";
import TradeService from "../services/Trade/TradeService";
import { get } from "lodash";
import CustomError from "../helpers/errors/CustomError";

class TradeController {
  tradeService: TradeService;

  constructor() {
    this.tradeService = new TradeService();
  }

  buy = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { amount, tokens, network } = req.body;

      const wallet = await this.tradeService.findWalletByUserId(
        get(req.user, "_id") as string
      );

      if (!wallet)
        throw next(new CustomError("Not Found", "Wallet not found", 404));

      const receipt = await this.tradeService.buy(
        amount,
        tokens,
        get(req.user, "_id") as string
      );

      if (!receipt)
        throw next(
          new CustomError("Internal Server Error", "Transaction failed", 500)
        );

      this.tradeService.createBuyTradeHistory(
        amount,
        get(req.user, "_id") as string,
        wallet?._id as string,
        receipt?.hash,
        tokens,
        "ethereum"
      );

      logger.info("Trade successfully happened");

      return res.status(200).json({ message: "Trade successfully happened" });
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };

  sell = async (req: RequestWithUser, res: Response) => {
    try {
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };

  history = async (req: RequestWithUser, res: Response) => {
    try {
      const tradeHistories = await this.tradeService.findTradeHistoriesByUserId(
        get(req.user, "_id") as string
      );

      logger.info("Trade histories successfully fetched");

      return res.status(200).json({ tradeHistories });
    } catch (err: any) {
      logger.error({
        status: 500,
        name: err.name,
        message: err.message,
      });
      return res.status(500).json({ error: err.message });
    }
  };
}

export default TradeController;
