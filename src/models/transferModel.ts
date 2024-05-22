import mongoose from "mongoose";
import { ITransfer } from "../types/Transfer";

export interface TransferDocument extends mongoose.Document, ITransfer {
  createdAt: Date;
  updatedAt: Date;
}

const transferSchema = new mongoose.Schema(
  {
    userWallet: { type: String, required: true },
    currentToken: { type: String, required: true },
    currentNetwork: { type: String, required: true },
    amountOfPay: { type: String, required: true },
    amountOfReceive: { type: String, required: true },
    tokenPrice: { type: String, required: true },
    stage: { type: String, required: true },
    isTransferred: { type: Boolean, default: false },
    hash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const transferModel =
  mongoose.models.Transfer ||
  mongoose.model<TransferDocument>("Transfer", transferSchema);

export default transferModel;
