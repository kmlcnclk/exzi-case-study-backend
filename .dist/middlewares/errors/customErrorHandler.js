"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../../helpers/errors/CustomError"));
// Custom error handler
const customErrorHandler = (err, req, res, next) => {
    let customError = err;
    if (err.name === "SyntaxError") {
        customError = new CustomError_1.default("Bad Request", "Unexpected Syntax", 400);
    }
    if (err.name === "ValidationError") {
        customError = new CustomError_1.default("Bad Request", err.message, 400);
    }
    if (err.name === "CastError") {
        customError = new CustomError_1.default("Bad Request", "Please provide a valid id", 400);
    }
    if (err.code === 11000) {
        customError = new CustomError_1.default("Bad Request", "Duplicate Key Found : Check Your Input", 400);
    }
    if (err.name === "TypeError") {
        customError = new CustomError_1.default("Bad Request", " Type Error : Please Check Your Input", 400);
    }
    return res.status(customError.status || 500).json({
        success: false,
        message: customError.message,
    });
};
exports.default = customErrorHandler;
