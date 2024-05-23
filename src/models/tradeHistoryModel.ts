import mongoose from "mongoose";
import { ITradeHistory } from "../types/TradeHistory";
import "./walletModel";
import "./userModel";

export interface TradeHistoryDocument extends ITradeHistory, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const tradeHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    tx: { type: String, required: true },
    amount: { type: Number, required: true },
    fromCoin: { type: String, required: true },
    toCoin: { type: String, required: true },
    status: { type: String, required: true, enum: ["buy", "sell"] },
    network: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const TradeHistoryModel =
  mongoose.models.TradeHistory ||
  mongoose.model<TradeHistoryDocument>("TradeHistory", tradeHistorySchema);

export default TradeHistoryModel;
