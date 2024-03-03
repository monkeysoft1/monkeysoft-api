import dotenv from "dotenv";
import path from "path";
import ExpressAdapter from "./infra/api/ExpressAdapter";
import Controller from "./infra/controller";
import MySqlConnection from "./infra/database/MySqlConnection";
import ErrorMiddleware from "./infra/middleware/ErrorMiddleware";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mysql = new MySqlConnection();

const express = new ExpressAdapter();

new Controller(mysql, express)
  .create()
  .then(() => {
    express.applyErrorMiddleware(ErrorMiddleware.execute);

    express.app.listen(process.env.PORT, () =>
      console.log(`Server running at port ${process.env.PORT}`)
    );
  })
  .catch((e) => console.log("Server has failed to initialized", e));
