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
      .filter((i) => !["index.ts", "IController.ts"].includes(i))
      .map((i) => i.split(".")[0]);

    for (const file of files) {
      new (await import(`./${file}`)).default(
        this.connection,
        this.httpServer
      ).initRoutes();
    }
  }
}
