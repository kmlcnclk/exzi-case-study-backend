"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtController_1 = __importDefault(require("../controllers/jwtController"));
class JwtRouter {
    constructor() {
        this.jwtController = new jwtController_1.default();
        this.jwtRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.createJwt();
    }
    createJwt() {
        this.jwtRouter.post("/refresh", this.jwtController.refresh);
    }
}
exports.default = JwtRouter;
