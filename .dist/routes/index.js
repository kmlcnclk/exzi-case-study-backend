"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const walletRouter_1 = __importDefault(require("./walletRouter"));
const jwtRouter_1 = __importDefault(require("./jwtRouter"));
const tradeRouter_1 = __importDefault(require("./tradeRouter"));
class MainRouter {
    constructor() {
        this.mainRouter = express_1.default.Router();
        this.userRouter = new userRouter_1.default();
        this.walletRouter = new walletRouter_1.default();
        this.jwtRouter = new jwtRouter_1.default();
        this.tradeRouter = new tradeRouter_1.default();
        this.use();
    }
    use() {
        this.mainRouter.use("/user", this.userRouter.userRouter);
        this.mainRouter.use("/jwt", this.jwtRouter.jwtRouter);
        this.mainRouter.use("/wallet", this.walletRouter.walletRouter);
        this.mainRouter.use("/trade", this.tradeRouter.tradeRouter);
    }
}
exports.default = new MainRouter();
