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
const jwtTokenModel_1 = __importDefault(require("../models/jwtTokenModel"));
const BaseDAO_1 = __importDefault(require("./BaseDAO"));
class JwtTokenDAO extends BaseDAO_1.default {
    constructor(model) {
        super(model);
    }
    create(user, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = new jwtTokenModel_1.default({ user, accessToken, refreshToken });
            const newToken = yield jwtToken.save();
            return {
                accessToken: newToken.accessToken,
                refreshToken: newToken.refreshToken,
            };
        });
    }
}
exports.default = new JwtTokenDAO(jwtTokenModel_1.default);
