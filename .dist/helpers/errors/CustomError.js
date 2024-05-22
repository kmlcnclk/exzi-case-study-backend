"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(name, message, status) {
        super(message);
        this.name = name;
        this.status = status;
    }
}
exports.default = CustomError;
