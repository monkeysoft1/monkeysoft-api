import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import ExpressAdapter from "./infra/api/ExpressAdapter";
import Controller from "./infra/controller";
import MySqlConnection from "./infra/database/MySqlConnection";
import Authentication from "./infra/middleware/Authentication";
import ErrorMiddleware from "./infra/middleware/ErrorMiddleware";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mysql = new MySqlConnection();
const express = new ExpressAdapter();
const controller = new Controller();

const allowedOrigin = [
  "https://portal.monkeyzap.com.br",
  "https://portal.monkeysoft.com.br",
  "https://portal-hml.monkeyzap.com.br",
  "https://portal-hml.monkeysoft.com.br",
];

express.app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigin.includes(origin || "")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const authentication = new Authentication(mysql);
express.applyErrorMiddleware(ErrorMiddleware.execute);
express.applyMiddleware(authentication.execute);

controller
  .create(mysql, express)
  .then(() => {
    express.applyErrorMiddleware(ErrorMiddleware.execute);
    express.listen(process.env.PORT, () =>
      console.log(`Server running at port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("Server has failed to initialized", e));
