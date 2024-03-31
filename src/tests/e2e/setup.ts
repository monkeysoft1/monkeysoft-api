import axios, { AxiosInstance } from "axios";
import { Server } from "http";
import ExpressAdapter from "../../infra/api/ExpressAdapter";
import Controller from "../../infra/controller";
import MySqlConnection from "../../infra/database/MySqlConnection";
import ErrorMiddleware from "../../infra/middleware/ErrorMiddleware";

const mysql = new MySqlConnection();
const server = new ExpressAdapter();
const controller = new Controller();

jest.mock("../../infra/database/MySqlConnection");

export default class TestServer {
  server!: Server;
  client!: AxiosInstance;

  start = async () => {
    await controller.create(mysql, server);
    server.applyErrorMiddleware(ErrorMiddleware.execute);

    this.server = server.app.listen();
    const port = (this.server.address() as any).port;
    this.startClient(port);
  };

  startClient = (port: number) => {
    this.client = axios.create({
      baseURL: `http://localhost:${port}`,
      validateStatus: (v) => v < 500,
    });
  };

  close = () => {
    this.server.close();
  };
}
