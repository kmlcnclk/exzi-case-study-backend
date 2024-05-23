import mongoose from "mongoose";
import { IWithdraw } from "../types/Withdraw";
import "./walletModel";
import "./userModel";

export interface WithdrawDocument extends IWithdraw, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const withdrawSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    tx: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const WithdrawModel =
  mongoose.models.Withdraw ||
  mongoose.model<WithdrawDocument>("Withdraw", withdrawSchema);

export default WithdrawModel;
