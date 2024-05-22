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
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("../logger"));
const UserService_1 = __importDefault(require("../services/User/UserService"));
class UserController {
    constructor() {
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const data = Object.assign({}, (0, lodash_1.omit)(userData, "passwordConfirmation"));
                const user = yield this.userService.createUser(data);
                const { accessToken, refreshToken } = yield this.userService.generateJwtToken(user);
                this.userService.createJWTToken(user._id, accessToken, refreshToken);
                logger_1.default.info("Sign up is successful");
                return res.status(201).json({
                    accessToken,
                    refreshToken,
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
        this.signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const signInData = req.body;
                const validated = yield this.userService.isValidatePassword(signInData);
                yield this.userService.updateJwtValidWithFalseOnDb((0, lodash_1.get)(validated, "_id"));
                const generatedTokensData = yield this.userService.generateWithIdAndSaveDbJwtToken(validated);
                logger_1.default.info("Login is successful");
                return res.status(200).json(Object.assign({}, generatedTokensData));
            }
            catch (err) {
                if (err.status) {
                    logger_1.default.error({
                        status: err.status,
                        name: err.name,
                        message: err.message,
                    });
                    return res.status(err.status).json({
                        error: {
                            name: err.name,
                            message: err.message,
                        },
                    });
                }
                logger_1.default.error({
                    status: 500,
                    name: err.name,
                    message: err.message,
                });
                return res.status(500).json({
                    error: {
                        name: err.name,
                        message: err.message,
                    },
                });
            }
        });
        this.userService = new UserService_1.default();
    }
}
exports.default = UserController;
