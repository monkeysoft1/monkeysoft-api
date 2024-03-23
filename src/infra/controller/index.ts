import fs from "fs";
import IHttpServer from "../api/IHttpServer";
import IConnection from "../database/IConnection";

export default class Controller {
  async create(connection: IConnection, httpServer: IHttpServer) {
    const files = fs
      .readdirSync(__dirname)
      .map((f) => f.substring(0, f.lastIndexOf(".")))
      .filter((i) => !["index", "IController"].includes(i));

    for (const file of files) {
      new (await import(`./${file}`)).default(connection, httpServer).initRoutes();
    }
  }
}
