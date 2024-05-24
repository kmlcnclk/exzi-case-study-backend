import express from "express";
import dotenv from "dotenv";
import MainRouter from "./routes";
import cors from "cors";
import helmet from "helmet";
import customErrorHandler from "./middlewares/errors/customErrorHandler";
import connectDatabase from "./helpers/db/connectionDatabase";
import rateLimit from "express-rate-limit";

dotenv.config({ path: "" });

const PORT = process.env.PORT;

connectDatabase();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(MainRouter.mainRouter);
app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
