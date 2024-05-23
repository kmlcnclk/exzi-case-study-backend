import { UserDocument } from "../models/userModel";
import { WalletDocument } from "../models/walletModel";

export interface ITradeHistory {
  user: UserDocument["_id"];
  wallet: WalletDocument["_id"];
  tx: string;
  amount: number;
  fromCoin: string;
  toCoin: string;
  status: string;
  network: string;
}

export type CreateTradeHistoryType = ITradeHistory;

export type ReturnedTradeHistoryType = ITradeHistory & {
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
};
