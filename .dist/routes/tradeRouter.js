"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Jwt_1 = require("../middlewares/Jwt");
const tradeController_1 = __importDefault(require("../controllers/tradeController"));
const UserDAO_1 = __importDefault(require("../data/UserDAO"));
class TradeRouter {
    constructor() {
        this.tradeController = new tradeController_1.default();
        this.tradeRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.buy();
        this.sell();
        this.history();
    }
    buy() {
        this.tradeRouter.post("/buy", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.tradeController.buy);
    }
    sell() {
        this.tradeRouter.post("/sell", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.tradeController.sell);
    }
    history() {
        this.tradeRouter.post("/history", [(0, Jwt_1.checkJwtAndUserExist)(UserDAO_1.default)], this.tradeController.history);
    }
}
exports.default = TradeRouter;
