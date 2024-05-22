"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../logger"));
function signJwt(object, keyName, options) {
    const signingKey = process.env[keyName];
    const data = jsonwebtoken_1.default.sign(object, signingKey, Object.assign(Object.assign({}, (options && options)), { algorithm: "HS256" }));
    return data;
}
exports.signJwt = signJwt;
function verifyJwt(token, keyName) {
    const publicKey = process.env[keyName];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded,
        };
    }
    catch (err) {
        logger_1.default.error({
            status: err.status,
            name: err.name,
            message: err.message,
        });
        return {
            valid: false,
            expired: err.message === "jwt expired",
            decoded: null,
        };
    }
}
exports.verifyJwt = verifyJwt;
