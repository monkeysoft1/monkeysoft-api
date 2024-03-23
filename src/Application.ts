import IHttpServer from "./infra/api/IHttpServer";
import Controller from "./infra/controller";
import IConnection from "./infra/database/IConnection";

export default class Application {
  constructor(
    readonly connection: IConnection,
    readonly httpServer: IHttpServer,
    readonly Controller: Controller
  ) {}

  private startController = async () => {
    this.Controller.create(this.connection, this.httpServer);
  };

  applyErrorMiddleware(callback: Function) {
    this.httpServer.applyErrorMiddleware(callback);
  }

  listen(port: number) {
    this.startController()
      .then(() => {
        this.httpServer.listen(port, () => {
          console.log(`Server running at port ${port}`);
        });
      })
      .catch((e) => console.log("Server has failed to initialized", e));
  }
}
