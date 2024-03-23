import CreateUserType from "../../core/usecase/userType/CreateUserType";
import GetAllUserTypes from "../../core/usecase/userType/GetAllUserType";
import GetUserTypeById from "../../core/usecase/userType/GetUserTypeById";
import UpdateUserType from "../../core/usecase/userType/UpdateUserType";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import UserTypeRepository from "../repository/UserTypeRepository";
import IController from "./IController";

export default class UserTypeController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/userType/:id", this.getById);
    this.httpServer.on("get", "/userType", this.getAll);
    this.httpServer.on("post", "/userType", this.create);
    this.httpServer.on("put", "/userType/:id", this.update);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userTypeRepository = new UserTypeRepository(this.connection);
    const getUserTypeById = new GetUserTypeById(userTypeRepository);
    const userType = await getUserTypeById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, userType);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userTypeRepository = new UserTypeRepository(this.connection);
    const getAllUserTypes = new GetAllUserTypes(userTypeRepository);

    const features = await getAllUserTypes.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userTypeRepository = new UserTypeRepository(this.connection);
    const createUserType = new CreateUserType(userTypeRepository);
    const userType = await createUserType.execute(body);

    return HttpResponse.json(201, userType);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userTypeRepository = new UserTypeRepository(this.connection);
    const updateUserType = new UpdateUserType(userTypeRepository);
    const userType = await updateUserType.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, userType);
  };
}
