"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletController_1 = __importDefault(require("../controllers/walletController"));
const Jwt_1 = require("../middlewares/Jwt");
const UserDAO_1 = __importDefault(require("../data/UserDAO"));
class WalletRouter {
    constructor() {
        this.walletController = new walletController_1.default();
        this.walletRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.createWallet();
        this.deposit();
        this.withdraw();
        this.balance();
    }
    createWallet() {
        this.walletRouter.post("/create-wallet", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.walletController.createWallet);
    }
    deposit() {
        this.walletRouter.post("/deposit", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.walletController.deposit);
    }
    withdraw() {
        this.walletRouter.post("/withdraw", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.walletController.withdraw);
    }
    balance() {
        this.walletRouter.post("/balance", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.walletController.balance);
    }
}
exports.default = WalletRouter;
