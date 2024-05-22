import { Model } from "mongoose";
import BaseDAO from "./BaseDAO";
import WalletModel, { WalletDocument } from "../models/walletModel";
import { IWallet } from "../types/Wallet";

class WalletDAO extends BaseDAO<WalletDocument> {
  constructor(model: Model<any>) {
    super(model);
  }

  public async create(walletData: IWallet): Promise<WalletDocument> {
    const wallet = await WalletModel.create(walletData);
    return wallet;
  }
}

export default new WalletDAO(WalletModel);
