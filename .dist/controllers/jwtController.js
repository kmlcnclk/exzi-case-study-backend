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
const JwtService_1 = __importDefault(require("../services/Jwt/JwtService"));
const logger_1 = __importDefault(require("../logger"));
class JwtController {
    constructor() {
        this.refresh = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = (0, lodash_1.get)(req, "headers.x-refresh");
                if (refreshToken != undefined || refreshToken) {
                    const refreshTokenResponse = yield this.jwtService.isValidRefreshToken(refreshToken);
                    if ((0, lodash_1.get)(refreshTokenResponse, "value") == true) {
                        //TODO: old token valid to invalid & new token generate - return
                        const user = (0, lodash_1.get)(refreshTokenResponse, "user");
                        yield this.jwtService.updateJwtValidWithFalseOnDb(user._id);
                        const generatedTokensData = yield this.jwtService.generateWithIdAndSaveDbJwtToken(user);
                        logger_1.default.info("JWT Refresh is successful");
                        return res.status(201).json(generatedTokensData);
                    }
                    else {
                        logger_1.default.error({
                            status: 403,
                            name: "Forbidden",
                            data: {
                                data: (0, lodash_1.get)(refreshTokenResponse, "value"),
                                message: (0, lodash_1.get)(refreshTokenResponse, "message"),
                            },
                        });
                        return res.status(403).json({
                            data: (0, lodash_1.get)(refreshTokenResponse, "value"),
                            message: (0, lodash_1.get)(refreshTokenResponse, "message"),
                        });
                    }
                }
                else {
                    logger_1.default.error({
                        status: 404,
                        name: "Not Found",
                        message: "JWT Refresh Token Do Not Exist",
                    });
                    return res
                        .status(404)
                        .json({ message: "JWT Refresh Token Do Not Exist" });
                }
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
        this.jwtService = new JwtService_1.default();
    }
}
exports.default = JwtController;
