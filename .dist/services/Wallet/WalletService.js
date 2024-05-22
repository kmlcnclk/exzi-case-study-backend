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
const node_rsa_1 = __importDefault(require("node-rsa"));
const WalletDAO_1 = __importDefault(require("../../data/WalletDAO"));
const EthereumKeyPair_1 = require("../../lib/EthereumKeyPair");
const uuid_1 = require("uuid");
const UserService_1 = __importDefault(require("../User/UserService"));
class WalletService {
    constructor() {
        this.createWallets = (walletType) => __awaiter(this, void 0, void 0, function* () {
            if (walletType === "ethereum") {
                const { address, privateKey } = this.createEthereumWallet();
                const hashOfPrivateKey = yield this.hashUserWalletPrivateKey(privateKey);
                return { address, hashOfPrivateKey, message: "" };
            }
            else if (walletType === "bitcoin") {
                // TODO: Create Bitcoin Wallet
                return { address: "", hashOfPrivateKey: "", message: "" };
            }
            else {
                return {
                    address: "",
                    hashOfPrivateKey: "",
                    message: "Invalid wallet type",
                };
            }
        });
        this.saveWalletToUser = (userId, walletId, walletType) => __awaiter(this, void 0, void 0, function* () {
            this.userService.saveWalletToUser(userId, walletId, walletType);
        });
        this._key = new node_rsa_1.default({ b: 512 });
        this.userService = new UserService_1.default();
    }
    hashUserWalletPrivateKey(walletPrivateKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const encrypted = yield this._key.encrypt(walletPrivateKey, "base64");
            return encrypted;
        });
    }
    decryptHashedWalletPrivateKey(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const decrypted = this._key.decrypt(hash, "utf8");
            return decrypted;
        });
    }
    createEthereumWallet() {
        const keyPairNewKey = new EthereumKeyPair_1.EthereumKeyPair();
        const privateKey = keyPairNewKey.getPrivateAddress();
        const address = keyPairNewKey.getPublicAddress();
        return { privateKey, address };
    }
    createWallet(userId, address, hashOfPrivateKey, walletType) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield WalletDAO_1.default.create({
                user: userId,
                address,
                privateKey: hashOfPrivateKey,
                profileImage: `https://www.gravatar.com/avatar/${(0, uuid_1.v4)()}?d=identicon`,
                type: walletType,
            });
            return wallet._id;
        });
    }
}
exports.default = WalletService;
