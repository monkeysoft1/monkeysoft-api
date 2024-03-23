import dotenv from "dotenv";
import path from "path";
import ExpressAdapter from "./infra/api/ExpressAdapter";
import Controller from "./infra/controller";
import MySqlConnection from "./infra/database/MySqlConnection";
import ErrorMiddleware from "./infra/middleware/ErrorMiddleware";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mysql = new MySqlConnection();
const express = new ExpressAdapter();
const controller = new Controller();

controller
  .create(mysql, express)
  .then(() => {
    express.applyErrorMiddleware(ErrorMiddleware.execute);
    express.listen(process.env.PORT, () =>
      console.log(`Server running at port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("Server has failed to initialized", e));
