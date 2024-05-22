import { Response } from "express";
import { RequestWithUser } from "../types/express";
import logger from "../logger";

class TradeController {
  buy = async (req: RequestWithUser, res: Response) => {
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
