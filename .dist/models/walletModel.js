"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    address: { type: String, required: true },
    privateKey: { type: String, required: true },
    profileImage: { type: String, required: true },
    type: { type: String, required: true, enum: ["ethereum", "bitcoin"] },
}, {
    timestamps: true,
});
const WalletModel = mongoose_1.default.models.Wallet ||
    mongoose_1.default.model("Wallet", walletSchema);
exports.default = WalletModel;
