import CreateSoftware from "../../core/usecase/CreateSoftware";
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
    this.httpServer.on("post", "/software", this.create);
    this.httpServer.on("put", "/software/:id", this.update);
  }

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const createSoftware = new CreateSoftware(softwareRepository);
    const software = await createSoftware.execute(body);

    return HttpResponse.json(201, software);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const updateSoftware = new UpdateSoftware(softwareRepository);
    const software = await updateSoftware.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, software);
  };
}
