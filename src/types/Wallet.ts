import { UserDocument } from "../models/userModel";

export interface IWallet {
  user: UserDocument["_id"];
  address: string;
  privateKey: string;
  profileImage: string;
}

export type CreateWalletType = IWallet;

export type ReturnedWalletType = Omit<IWallet, "privateKey"> & {
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
};
