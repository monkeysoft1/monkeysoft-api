import UpdateSoftware from "../../core/usecase/UpdateSoftware";
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
    this.httpServer.on("put", "/software", this.update);
  }

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const updateSoftware = new UpdateSoftware(softwareRepository);
    const software = await updateSoftware.execute(body);

    return HttpResponse.json(201, software);
  };
}
