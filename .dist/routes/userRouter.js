"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../middlewares/User");
const userSchema_1 = require("../schemas/userSchema");
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const userController_1 = __importDefault(require("../controllers/userController"));
class UserRouter {
    constructor() {
        this.userController = new userController_1.default();
        this.userRouter = express_1.default.Router();
        this.routes();
    }
    routes() {
        this.signUp();
        this.signIn();
    }
    signUp() {
        this.userRouter.post("/sign-up", [(0, validateResource_1.default)(userSchema_1.createUserSchema), User_1.isUserEmailExists], this.userController.signUp);
    }
    signIn() {
        this.userRouter.post("/sign-in", [(0, validateResource_1.default)(userSchema_1.signInSchema)], this.userController.signIn);
    }
}
exports.default = UserRouter;
