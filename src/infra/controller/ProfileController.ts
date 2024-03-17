import AddFeature from "../../core/usecase/profile/AddFeature";
import CreateProfile from "../../core/usecase/profile/CreateProfile";
import GetAllProfiles from "../../core/usecase/profile/GetAllProfiles";
import GetProfileById from "../../core/usecase/profile/GetFeaturesByProfileId";
import UpdateProfile from "../../core/usecase/profile/UpdateProfile";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import FeatureRepository from "../repository/FeatureRepository";
import ProfileRepository from "../repository/ProfileRepository";
import SoftwareRepository from "../repository/SoftwareRepository";
import IController from "./IController";

export default class ProfileController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/profile/:id", this.getById);
    this.httpServer.on("get", "/profile", this.getAll);
    this.httpServer.on("post", "/profile", this.create);
    this.httpServer.on("post", "/profile/add-feature", this.addFeature);
    this.httpServer.on("put", "/profile/:id", this.update);
  }

  addFeature = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProfileRepository(this.connection);
    const featureRepository = new FeatureRepository(this.connection);
    const addFeature = new AddFeature(profileRepository, featureRepository);

    const feature = await addFeature.execute(body);

    return HttpResponse.json(201, feature);
  };

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProfileRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const featureRepository = new FeatureRepository(this.connection);
    const getProfileById = new GetProfileById(
      profileRepository,
      featureRepository,
      softwareRepository
    );
    const profile = await getProfileById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, profile);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProfileRepository(this.connection);
    const getAllProfiles = new GetAllProfiles(profileRepository);

    const profiles = await getAllProfiles.execute(params.query);

    return HttpResponse.json(200, profiles);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProfileRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const createProfile = new CreateProfile(profileRepository, softwareRepository);

    const profile = await createProfile.execute(body);

    return HttpResponse.json(201, profile);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProfileRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const updateProfile = new UpdateProfile(profileRepository, softwareRepository);
    const profile = await updateProfile.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, profile);
  };
}
