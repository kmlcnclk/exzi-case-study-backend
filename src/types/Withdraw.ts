import { UserDocument } from "../models/userModel";
import { WalletDocument } from "../models/walletModel";

export interface IWithdraw {
  user: UserDocument["_id"];
  wallet: WalletDocument["_id"];
  tx: string;
}

export type CreateWithdrawType = IWithdraw;

export type ReturnedWithdrawType = IWithdraw & {
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
};
