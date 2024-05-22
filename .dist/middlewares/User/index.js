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
exports.isUserEmailExists = void 0;
const UserDAO_1 = __importDefault(require("../../data/UserDAO"));
const logger_1 = __importDefault(require("../../logger"));
const lodash_1 = require("lodash");
const isUserEmailExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const isUserEmailExist = yield UserDAO_1.default.findOne({
            email: userData.email,
        });
        if ((0, lodash_1.get)(req, "user") && (isUserEmailExist === null || isUserEmailExist === void 0 ? void 0 : isUserEmailExist._id) == (0, lodash_1.get)(req, "user._id")) {
            logger_1.default.error({
                status: 400,
                name: "Bad Request",
                message: "You already have this email",
            });
            return res.status(400).json({
                message: "You already have this email",
            });
        }
        if (isUserEmailExist) {
            logger_1.default.error({
                status: 400,
                name: "Bad Request",
                message: "Email is already exist",
            });
            return res.status(400).json({
                message: "Email is already exist",
            });
        }
        return next();
    }
    catch (err) {
        logger_1.default.error({
            status: 400,
            name: "Bad Request",
            message: err.message,
        });
        return res.status(400).json({ error: err.message });
    }
});
exports.isUserEmailExists = isUserEmailExists;
