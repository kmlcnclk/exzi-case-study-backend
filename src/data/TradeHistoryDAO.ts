import { Model } from "mongoose";
import BaseDAO from "./BaseDAO";
import TradeHistoryModel, {
  TradeHistoryDocument,
} from "../models/tradeHistoryModel";
import { ITradeHistory } from "../types/TradeHistory";

class TradeHistoryDAO extends BaseDAO<TradeHistoryDocument> {
  constructor(model: Model<any>) {
    super(model);
  }

  public async create(
    tradeHistoryData: ITradeHistory
  ): Promise<TradeHistoryDocument> {
    const tradeHistory = await TradeHistoryModel.create(tradeHistoryData);
    return tradeHistory;
  }
}

export default new TradeHistoryDAO(TradeHistoryModel);
