import CreateSession from "../../core/usecase/session/CreateSession";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import SessionRepository from "../repository/SessionRepository";
import UserRepository from "../repository/UserRepository";
import IController from "./IController";

export default class SessionController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("post", "/signin", this.signIn);
  }

  signIn = async (params: IParams, body: any): Promise<JsonResponse> => {
    const sessionRepository = new SessionRepository(this.connection);
    const userRepository = new UserRepository(this.connection);
    const createSession = new CreateSession(sessionRepository, userRepository);

    const session = await createSession.execute(body);

    return HttpResponse.json(200, session);
  };
}
