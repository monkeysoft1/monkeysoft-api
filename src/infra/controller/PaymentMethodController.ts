import CreatePaymentMethod from "../../core/usecase/paymentMethod/CreatePaymentMethod";
import GetAllPaymentMethods from "../../core/usecase/paymentMethod/GetAllPaymentMethods";
import GetPaymentMethodById from "../../core/usecase/paymentMethod/GetPaymentMethodById";
import UpdatePaymentMethod from "../../core/usecase/paymentMethod/UpdatePaymentMethod";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import PaymentMethodRepository from "../repository/PaymentMethodRepository";
import IController from "./IController";

export default class PaymentMethodController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/paymentMethod/:id", this.getById);
    this.httpServer.on("get", "/paymentMethod", this.getAll);
    this.httpServer.on("post", "/paymentMethod", this.create);
    this.httpServer.on("put", "/paymentMethod/:id", this.update);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const paymentMethodRepository = new PaymentMethodRepository(this.connection);
    const getPaymentMethodById = new GetPaymentMethodById(paymentMethodRepository);
    const paymentMethod = await getPaymentMethodById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, paymentMethod);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const paymentMethodRepository = new PaymentMethodRepository(this.connection);
    const getAllPaymentMethods = new GetAllPaymentMethods(paymentMethodRepository);

    const features = await getAllPaymentMethods.execute(params.query);

    return HttpResponse.json(200, features);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const paymentMethodRepository = new PaymentMethodRepository(this.connection);
    const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
    const paymentMethod = await createPaymentMethod.execute(body);

    return HttpResponse.json(201, paymentMethod);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const paymentMethodRepository = new PaymentMethodRepository(this.connection);
    const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);
    const paymentMethod = await updatePaymentMethod.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, paymentMethod);
  };
}
