import CreateUser from "../../core/usecase/user/CreateUser";
import GetAllUsers from "../../core/usecase/user/GetAllUsers";
import GetUserById from "../../core/usecase/user/GetUserById";
import UpdateUser from "../../core/usecase/user/UpdateUser";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import UserRepository from "../repository/UserRepository";
import UserTypeRepository from "../repository/UserTypeRepository";
import IController from "./IController";

export default class UserController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/user/:id", this.getById);
    this.httpServer.on("get", "/user", this.getAll);
    this.httpServer.on("post", "/user", this.create);
    this.httpServer.on("put", "/user/:id", this.update);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userRepository = new UserRepository(this.connection);
    const userTypeRepository = new UserTypeRepository(this.connection);

    const getUserById = new GetUserById(userRepository, userTypeRepository);
    const user = await getUserById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, user);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userRepository = new UserRepository(this.connection);
    const getAllUsers = new GetAllUsers(userRepository);

    const features = await getAllUsers.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userRepository = new UserRepository(this.connection);
    const userTypeRepository = new UserTypeRepository(this.connection);
    const createUser = new CreateUser(userRepository, userTypeRepository);
    const user = await createUser.execute(body);

    return HttpResponse.json(201, user);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const userRepository = new UserRepository(this.connection);
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, user);
  };
}
