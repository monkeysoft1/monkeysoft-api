import CreateGateway from "../../core/usecase/gateway/CreateGateway";
import GetAllGateways from "../../core/usecase/gateway/GetAllGateways";
import GetGatewayById from "../../core/usecase/gateway/GetGatewayById";
import UpdateGateway from "../../core/usecase/gateway/UpdateGateway";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import GatewayRepository from "../repository/GatewayRepository";
import IController from "./IController";

export default class GatewayController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/gateway/:id", this.getById);
    this.httpServer.on("get", "/gateway", this.getAll);
    this.httpServer.on("post", "/gateway", this.create);
    this.httpServer.on("put", "/gateway/:id", this.update);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const gatewayRepository = new GatewayRepository(this.connection);
    const getGatewayById = new GetGatewayById(gatewayRepository);
    const gateway = await getGatewayById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, gateway);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const gatewayRepository = new GatewayRepository(this.connection);
    const getAllGateways = new GetAllGateways(gatewayRepository);

    const features = await getAllGateways.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const gatewayRepository = new GatewayRepository(this.connection);
    const createGateway = new CreateGateway(gatewayRepository);
    const gateway = await createGateway.execute(body);

    return HttpResponse.json(201, gateway);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const gatewayRepository = new GatewayRepository(this.connection);
    const updateGateway = new UpdateGateway(gatewayRepository);
    const gateway = await updateGateway.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, gateway);
  };
}
