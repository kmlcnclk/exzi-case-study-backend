"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Connect Database
const connectDatabase = () => {
    const MONGO_URI = process.env.MONGO_URI;
    mongoose_1.default
        .connect(MONGO_URI, {})
        .then(() => {
        console.log("Mongo DB Connection Successful");
    })
        .catch((err) => {
        console.error(err);
    });
};
exports.default = connectDatabase;
