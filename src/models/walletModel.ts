import mongoose from "mongoose";
import { IWallet } from "../types/Wallet";

export interface WalletDocument extends IWallet, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, required: true },
    privateKey: { type: String, required: true },
    profileImage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const WalletModel =
  mongoose.models.Wallet ||
  mongoose.model<WalletDocument>("Wallet", walletSchema);

export default WalletModel;
