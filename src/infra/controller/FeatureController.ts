import CreateFeature from "../../core/usecase/CreateFeature";
import GetAllFeatures from "../../core/usecase/GetAllFeatures";
import UpdateFeature from "../../core/usecase/UpdateFeature";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import FeatureRepository from "../repository/FeatureRepository";
import SoftwareRepository from "../repository/SoftwareRepository";
import IController from "./IController";

export default class FeatureController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/feature", this.getAll);
    this.httpServer.on("post", "/feature", this.create);
    this.httpServer.on("put", "/feature/:id", this.update);
  }

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const featureRepository = new FeatureRepository(this.connection);
    const getAllFeatures = new GetAllFeatures(featureRepository);

    const features = await getAllFeatures.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const featureRepository = new FeatureRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const createFeature = new CreateFeature(featureRepository, softwareRepository);

    const feature = await createFeature.execute(body);

    return HttpResponse.json(201, feature);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const featureRepository = new FeatureRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const updateFeature = new UpdateFeature(featureRepository, softwareRepository);
    const feature = await updateFeature.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, feature);
  };
}
