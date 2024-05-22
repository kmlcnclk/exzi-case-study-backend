import { format, createLogger, transports } from "winston";
import dayjs from "dayjs";

const tsFormat = () => dayjs().format("DD/MM/YYYY HH:mm:ss");

const customFormat = format.combine(
  format.timestamp({ format: tsFormat }),
  format.colorize(),
  format.printf((info: any) => {
    return `[${info.timestamp}] - [${info.level}]: ${info.message}`;
  })
);

const errorFilter = format((info, opts) => {
  return info.level.includes("error") ? info : false;
});

const warnFilter = format((info, opts) => {
  return info.level.includes("warn") ? info : false;
});

const infoFilter = format((info, opts) => {
  return info.level.includes("info") ? info : false;
});

const logger = createLogger({
  format: customFormat,
  level: "info",
  transports: [
    new transports.File({
      dirname: "src/logger/logs/",
      filename: "info.log",
      level: "info",
      format: format.combine(
        infoFilter(),
        format.timestamp({ format: tsFormat }),
        format.printf(({ level, timestamp, ...others }) => {
          return `[${timestamp}] - [INFO]: ${JSON.stringify(others)}`;
        })
      ),
    }),
    new transports.File({
      dirname: "src/logger/logs/",
      filename: "error.log",
      level: "error",
      format: format.combine(
        errorFilter(),
        format.timestamp({ format: tsFormat }),
        format.printf(({ level, timestamp, ...others }) => {
          return `[${timestamp}] - [ERROR]: ${JSON.stringify(others)}`;
        })
      ),
    }),
    new transports.File({
      dirname: "src/logger/logs/",
      filename: "warn.log",
      level: "warn",
      format: format.combine(
        warnFilter(),
        format.timestamp({ format: tsFormat }),
        format.printf(({ level, timestamp, ...others }) => {
          return `[${timestamp}] - [WARN]: ${JSON.stringify(others)}`;
        })
      ),
    }),
    new transports.Console({ format: customFormat }),
  ],
});

export default logger;
