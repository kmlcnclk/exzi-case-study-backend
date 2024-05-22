"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WalletService_1 = __importDefault(require("../services/Wallet/WalletService"));
const logger_1 = __importDefault(require("../logger"));
const lodash_1 = require("lodash");
const CustomError_1 = __importDefault(require("../helpers/errors/CustomError"));
class WalletController {
    constructor() {
        this.createWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = req.body;
                const { address, hashOfPrivateKey, message } = yield this.walletService.createWallets(walletData.type);
                if (message !== "")
                    throw new CustomError_1.default("Bad Request", message, 400);
                const walletId = yield this.walletService.createWallet((0, lodash_1.get)(req.user, "_id"), address, hashOfPrivateKey, walletData.type);
                this.walletService.saveWalletToUser((0, lodash_1.get)(req.user, "_id"), walletId, walletData.type);
                logger_1.default.info("Wallet successfully created");
                return res.status(201).json({
                    message: "Wallet successfully created",
                });
            }
            catch (err) {
                logger_1.default.error({
                    status: 500,
                    name: err.name,
                    message: err.message,
                });
                return res.status(500).json({ error: err.message });
            }
        });
        this.deposit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (err) {
                logger_1.default.error({
                    status: 500,
                    name: err.name,
                    message: err.message,
                });
                return res.status(500).json({ error: err.message });
            }
        });
        this.withdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (err) {
                logger_1.default.error({
                    status: 500,
                    name: err.name,
                    message: err.message,
                });
                return res.status(500).json({ error: err.message });
            }
        });
        this.balance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (err) {
                logger_1.default.error({
                    status: 500,
                    name: err.name,
                    message: err.message,
                });
                return res.status(500).json({ error: err.message });
            }
        });
        this.walletService = new WalletService_1.default();
    }
}
exports.default = WalletController;
