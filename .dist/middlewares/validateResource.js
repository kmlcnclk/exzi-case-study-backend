"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
            });
            return next();
        }
        catch (err) {
            logger_1.default.error({
                status: 400,
                name: "Bad Request",
                errors: err.errors,
            });
            return res.status(400).send(err.errors);
        }
    };
};
exports.default = validate;
