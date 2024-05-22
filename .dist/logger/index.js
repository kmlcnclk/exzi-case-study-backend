"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const dayjs_1 = __importDefault(require("dayjs"));
const tsFormat = () => (0, dayjs_1.default)().format("DD/MM/YYYY HH:mm:ss");
const customFormat = winston_1.format.combine(winston_1.format.timestamp({ format: tsFormat }), winston_1.format.colorize(), winston_1.format.printf((info) => {
    return `[${info.timestamp}] - [${info.level}]: ${info.message}`;
}));
const errorFilter = (0, winston_1.format)((info, opts) => {
    return info.level.includes("error") ? info : false;
});
const warnFilter = (0, winston_1.format)((info, opts) => {
    return info.level.includes("warn") ? info : false;
});
const infoFilter = (0, winston_1.format)((info, opts) => {
    return info.level.includes("info") ? info : false;
});
const logger = (0, winston_1.createLogger)({
    format: customFormat,
    level: "info",
    transports: [
        new winston_1.transports.File({
            dirname: "src/logger/logs/",
            filename: "info.log",
            level: "info",
            format: winston_1.format.combine(infoFilter(), winston_1.format.timestamp({ format: tsFormat }), winston_1.format.printf((_a) => {
                var { level, timestamp } = _a, others = __rest(_a, ["level", "timestamp"]);
                return `[${timestamp}] - [INFO]: ${JSON.stringify(others)}`;
            })),
        }),
        new winston_1.transports.File({
            dirname: "src/logger/logs/",
            filename: "error.log",
            level: "error",
            format: winston_1.format.combine(errorFilter(), winston_1.format.timestamp({ format: tsFormat }), winston_1.format.printf((_a) => {
                var { level, timestamp } = _a, others = __rest(_a, ["level", "timestamp"]);
                return `[${timestamp}] - [ERROR]: ${JSON.stringify(others)}`;
            })),
        }),
        new winston_1.transports.File({
            dirname: "src/logger/logs/",
            filename: "warn.log",
            level: "warn",
            format: winston_1.format.combine(warnFilter(), winston_1.format.timestamp({ format: tsFormat }), winston_1.format.printf((_a) => {
                var { level, timestamp } = _a, others = __rest(_a, ["level", "timestamp"]);
                return `[${timestamp}] - [WARN]: ${JSON.stringify(others)}`;
            })),
        }),
        new winston_1.transports.Console({ format: customFormat }),
    ],
});
exports.default = logger;
