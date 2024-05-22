"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const customErrorHandler_1 = __importDefault(require("./middlewares/errors/customErrorHandler"));
const connectionDatabase_1 = __importDefault(require("./helpers/db/connectionDatabase"));
dotenv_1.default.config({ path: "" });
const PORT = process.env.PORT;
(0, connectionDatabase_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(routes_1.default.mainRouter);
app.use(customErrorHandler_1.default);
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
