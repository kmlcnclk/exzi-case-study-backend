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
exports.checkJwtAndUserExist = void 0;
const lodash_1 = require("lodash");
const jwt_1 = require("../../lib/jwt");
const logger_1 = __importDefault(require("../../logger"));
const CustomError_1 = __importDefault(require("../../helpers/errors/CustomError"));
const checkUserExist = (userId, dao) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const where = { _id: userId };
        const data = yield dao.exist(where);
        if (data)
            return true;
        return false;
    }
    catch (err) {
        // TODO: log
        throw new CustomError_1.default(err.name, err.message, err.status);
    }
});
const checkJwtAndUserExist = (dao) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = (0, lodash_1.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
            if (accessToken) {
                const { decoded, expired } = (0, jwt_1.verifyJwt)(accessToken, "ACCESS_TOKEN_PRIVATE_KEY");
                if (expired)
                    throw new CustomError_1.default("Bad Request", "JWT Token Expired", 400);
                const userId = (0, lodash_1.get)(decoded, "_id");
                if (userId) {
                    const user = yield checkUserExist(userId, dao);
                    if (user) {
                        req.user = decoded;
                        return next();
                    }
                    else
                        throw new CustomError_1.default("Not Found", "User Not Found", 404);
                }
                else
                    throw new CustomError_1.default("Not Found", "User Not Found", 404);
            }
            else
                throw new CustomError_1.default("Bad Request", "JWT Token Not Found", 400);
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
};
exports.checkJwtAndUserExist = checkJwtAndUserExist;
