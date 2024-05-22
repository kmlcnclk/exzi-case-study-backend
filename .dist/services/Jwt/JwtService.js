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
const jwt_1 = require("../../lib/jwt");
const JwtTokenDAO_1 = __importDefault(require("../../data/JwtTokenDAO"));
const mongoose_1 = __importDefault(require("mongoose"));
const lodash_1 = require("lodash");
const logger_1 = __importDefault(require("../../logger"));
class JwtService {
    constructor() {
        this.isValidRefreshToken = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            const { decoded, expired } = (0, jwt_1.verifyJwt)(refreshToken, "REFRESH_TOKEN_PRIVATE_KEY");
            // valid can't be empty & need to be valid=true
            if (!decoded)
                return { value: false, message: "Decode Failed" };
            const userId = (0, lodash_1.get)(decoded, "_id");
            if (userId == undefined)
                return { value: false, message: "User Not Found" };
            const where = { refreshToken: refreshToken, user: userId, valid: true };
            const jwtToken = yield JwtTokenDAO_1.default.findOne(where);
            if (jwtToken != undefined || jwtToken)
                return { value: true, message: "JWT Token Still Valid", user: decoded };
            // TODO: LOG return value need log
            return { value: false, message: "JWT Token Invalid" };
        });
        this.createJWTToken = (userId, accessToken, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            yield JwtTokenDAO_1.default.create(userId, accessToken, refreshToken);
        });
    }
    generateJwtToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObject = {
                name: (0, lodash_1.get)(user, "name"),
                email: (0, lodash_1.get)(user, "email"),
                _id: (0, lodash_1.get)(user, "_id"),
                createdAt: (0, lodash_1.get)(user, "createdAt"),
            };
            const accessToken = (0, jwt_1.signJwt)(userObject, "ACCESS_TOKEN_PRIVATE_KEY", {
                expiresIn: process.env.ACCESS_TOKEN_TTL,
            });
            const refreshToken = (0, jwt_1.signJwt)(userObject, "REFRESH_TOKEN_PRIVATE_KEY", {
                expiresIn: process.env.REFRESH_TOKEN_TTL,
            });
            return { accessToken, refreshToken };
        });
    }
    generateWithIdAndSaveDbJwtToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const generatedJwtTokens = yield this.generateJwtToken(user);
            // saved on db
            const generatedTokens = yield JwtTokenDAO_1.default.create(new mongoose_1.default.Types.ObjectId((0, lodash_1.get)(user, "_id")), (0, lodash_1.get)(generatedJwtTokens, "accessToken"), (0, lodash_1.get)(generatedJwtTokens, "refreshToken"));
            return generatedTokens;
        });
    }
    updateJwtValidWithFalseOnDb(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { user: new mongoose_1.default.Types.ObjectId(userId) };
            const update = { valid: false };
            // TODO: log updated data values
            const t = yield JwtTokenDAO_1.default.updateMany(where, update);
            logger_1.default.info({
                data: t,
                message: "JWTTokenDAO Updated",
            });
        });
    }
}
exports.default = JwtService;
