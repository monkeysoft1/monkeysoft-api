import dotenv from "dotenv";
import path from "path";
import Application from "./Application";
import ExpressAdapter from "./infra/api/ExpressAdapter";
import Controller from "./infra/controller";
import MySqlConnection from "./infra/database/MySqlConnection";
import ErrorMiddleware from "./infra/middleware/ErrorMiddleware";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const mysql = new MySqlConnection();
const express = new ExpressAdapter();
const controller = new Controller();

const app = new Application(mysql, express, controller);
app.applyErrorMiddleware(ErrorMiddleware.execute);

app.listen(process.env.PORT);
