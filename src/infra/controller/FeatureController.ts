import CreateFeature from "../../core/usecase/CreateFeature";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import FeatureRepository from "../repository/FeatureRepository";
import IController from "./IController";

export default class FeatureController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("post", "/feature", this.create);
  }

  create = async (params: IParams, body: any): Promise<JsonResponse> =>{
    const featureRepository = new FeatureRepository(this.connection);
    const createFeature = new CreateFeature(featureRepository);
    const feature = await createFeature.execute(body);

    return HttpResponse.json(201, feature);
  }
}
