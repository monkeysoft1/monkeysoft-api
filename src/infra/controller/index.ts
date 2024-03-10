import fs from "fs";
import IHttpServer from "../api/IHttpServer";
import IConnection from "../database/IConnection";

export default class Controller {
  constructor(
    readonly connection: IConnection,
    readonly httpServer: IHttpServer
  ) {}
  async create() {
    const files = fs
      .readdirSync(__dirname)
      .map((f) => f.substring(0, f.lastIndexOf(".")))
      .filter((i) => !["index", "IController"].includes(i));

    for (const file of files) {
      new (await import(`./${file}`)).default(this.connection, this.httpServer).initRoutes();
    }
  }
}
