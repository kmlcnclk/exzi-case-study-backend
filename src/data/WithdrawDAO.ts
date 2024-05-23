import { Model } from "mongoose";
import BaseDAO from "./BaseDAO";
import WithdrawModel, { WithdrawDocument } from "../models/withdrawModel";
import { IWithdraw } from "../types/Withdraw";

class WithdrawDAO extends BaseDAO<WithdrawDocument> {
  constructor(model: Model<any>) {
    super(model);
  }

  public async create(withdrawData: IWithdraw): Promise<WithdrawDocument> {
    const withdraw = await WithdrawModel.create(withdrawData);
    return withdraw;
  }
}

export default new WithdrawDAO(WithdrawModel);
