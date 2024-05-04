import CreateSoftware from "../../core/usecase/software/CreateSoftware";
import GetAllSoftwares from "../../core/usecase/software/GetAllSoftwares";
import GetSoftwareById from "../../core/usecase/software/GetSoftwareById";
import UpdateSoftware from "../../core/usecase/software/UpdateSoftware";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import FeatureRepository from "../repository/FeatureRepository";
import LogRepository from "../repository/LogRepository";
import ProductRepository from "../repository/ProductRepository";
import ProfileRepository from "../repository/ProfileRepository";
import SoftwareRepository from "../repository/SoftwareRepository";
import IController from "./IController";

export default class SoftwareController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/software/:id", this.getById);
    this.httpServer.on("get", "/software", this.getAll);
    this.httpServer.on("post", "/software", this.create);
    this.httpServer.on("put", "/software/:id", this.update);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const featureRepository = new FeatureRepository(this.connection);
    const profileRepository = new ProfileRepository(this.connection);
    const productRepository = new ProductRepository(this.connection);
    const getSoftwareById = new GetSoftwareById(
      softwareRepository,
      profileRepository,
      featureRepository,
      productRepository
    );
    const software = await getSoftwareById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, software);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const getAllSoftwares = new GetAllSoftwares(softwareRepository);

    const features = await getAllSoftwares.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const createSoftware = new CreateSoftware(softwareRepository);
    const software = await createSoftware.execute(body);

    return HttpResponse.json(201, software);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const softwareRepository = new SoftwareRepository(this.connection);
    const logRepository = new LogRepository(this.connection);
    const updateSoftware = new UpdateSoftware(softwareRepository, logRepository);
    const software = await updateSoftware.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, software);
  };
}
