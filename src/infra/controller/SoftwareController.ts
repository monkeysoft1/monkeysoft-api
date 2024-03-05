import CreateSoftware from "../../core/usecase/CreateSoftware";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import SoftwareRepository from "../repository/SoftwareRepository";
import IController from "./IController";

export default class SoftwareController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("post", "/software", this.create);
  }

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const createSoftware = new CreateSoftware(softwareRepository);
    const software = await createSoftware.execute(body);

    return HttpResponse.json(201, software);
  }
}
