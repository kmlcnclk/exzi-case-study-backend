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
const userModel_1 = __importDefault(require("../../models/userModel"));
const CustomError_1 = __importDefault(require("../../helpers/errors/CustomError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const JwtService_1 = __importDefault(require("../Jwt/JwtService"));
const UserDAO_1 = __importDefault(require("../../data/UserDAO"));
class UserService {
    constructor() {
        this.generateJwtToken = (user) => __awaiter(this, void 0, void 0, function* () {
            const { accessToken, refreshToken } = yield this.jwtService.generateJwtToken(user);
            return { accessToken, refreshToken };
        });
        this.createJWTToken = (userId, accessToken, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            this.jwtService.createJWTToken(userId, accessToken, refreshToken);
        });
        this.createUser = (data) => __awaiter(this, void 0, void 0, function* () {
            const user = yield UserDAO_1.default.create(data);
            return user;
        });
        this.saveWalletToUser = (userId, walletId, walletType) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findUserByID(userId);
            if (walletType === "ethereum") {
                user.ethereumWallet = walletId;
            }
            else if (walletType === "bitcoin") {
                user.bitcoinWallet = walletId;
            }
            yield user.save();
        });
        this.isValidatePassword = (data) => __awaiter(this, void 0, void 0, function* () {
            const resData = yield this.validatePasswordWithEmail(data);
            return resData;
        });
        this.updateJwtValidWithFalseOnDb = (userId) => __awaiter(this, void 0, void 0, function* () {
            yield this.jwtService.updateJwtValidWithFalseOnDb(userId);
        });
        this.generateWithIdAndSaveDbJwtToken = (user) => __awaiter(this, void 0, void 0, function* () {
            const generatedTokensData = yield this.jwtService.generateWithIdAndSaveDbJwtToken(user);
            return generatedTokensData;
        });
        this.saltWorkFactor = process.env.SALT_WORK_FACTOR;
        this.jwtService = new JwtService_1.default();
    }
    hashingPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(this.saltWorkFactor);
            const hash = yield bcrypt_1.default.hashSync(password, salt);
            return hash;
        });
    }
    getUserWallet(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userID);
            if (!user)
                throw new CustomError_1.default("Not Found", "User is not exist", 404);
            return user.userWallet;
        });
    }
    checkUserExistWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            if (!user)
                throw new CustomError_1.default("Not Found", "Email is not exist", 404);
            return user;
        });
    }
    checkUserExistWithID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userID);
            if (!user)
                throw new CustomError_1.default("Not Found", "User is not exist", 404);
            return user;
        });
    }
    findUserByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userID);
            if (!user)
                throw new CustomError_1.default("Not Found", "User is not found", 404);
            return user;
        });
    }
    validatePasswordWithEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
            const user = yield this.checkUserExistWithEmail(email);
            const isValid = yield user.comparePassword(password);
            if (!isValid)
                throw new CustomError_1.default("Bad Request", "Password is not correct", 400);
            return (0, lodash_1.omit)(user.toJSON(), "password");
        });
    }
    validatePasswordWithID(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userID, password, }) {
            const user = yield this.checkUserExistWithID(userID);
            const isValid = yield user.comparePassword(password);
            if (!isValid)
                throw new CustomError_1.default("Bad Request", "Password is not correct", 400);
            return (0, lodash_1.omit)(user.toJSON(), "password");
        });
    }
    generateRandomString(length) {
        return (0, uuid_1.v4)().replace(/-/g, "").substr(0, length);
    }
    hashStringWithSHA256(inputString) {
        return (0, sha256_1.default)(inputString).toString();
    }
    getResetPasswordHash() {
        return __awaiter(this, void 0, void 0, function* () {
            const randomString = yield this.generateRandomString(15);
            const hashedString = yield this.hashStringWithSHA256(randomString);
            return hashedString;
        });
    }
}
exports.default = UserService;
