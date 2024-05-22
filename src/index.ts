import express from "express";
import dotenv from "dotenv";
import MainRouter from "./routes";
import cors from "cors";
import helmet from "helmet";
import customErrorHandler from "./middlewares/errors/customErrorHandler";
import connectDatabase from "./helpers/db/connectionDatabase";

dotenv.config({ path: "" });

const PORT = process.env.PORT;

connectDatabase();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(MainRouter.mainRouter);
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
