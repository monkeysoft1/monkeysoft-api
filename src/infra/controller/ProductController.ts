import AddGateway from "../../core/usecase/product/AddGateway";
import CreateProduct from "../../core/usecase/product/CreateProduct";
import GetAllProducts from "../../core/usecase/product/GetAllProducts";
import GetProduct from "../../core/usecase/product/GetProduct";
import RemoveGateway from "../../core/usecase/product/RemoveGateway";
import UpdateGateway from "../../core/usecase/product/UpdateGateway";
import UpdateProduct from "../../core/usecase/product/UpdateProduct";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
import GatewayRepository from "../repository/GatewayRepository";
import ProductRepository from "../repository/ProductRepository";
import SoftwareRepository from "../repository/SoftwareRepository";
import IController from "./IController";

export default class ProductController implements IController {
  constructor(
    private connection: IConnection,
    private httpServer: IHttpServer
  ) {}

  initRoutes() {
    this.httpServer.on("get", "/product/:id", this.getById);
    this.httpServer.on("get", "/product", this.getAll);
    this.httpServer.on("post", "/product", this.create);
    this.httpServer.on("put", "/product/:id", this.update);
    this.httpServer.on("post", "/product/addGateway", this.addGateway);
    this.httpServer.on("put", "/product/updateGateway", this.updateGateway);
    this.httpServer.on("delete", "/product/removeGateway", this.removeGateway);
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const gatewayRepository = new GatewayRepository(this.connection);

    const getProductById = new GetProduct(
      productRepository,
      gatewayRepository,
      softwareRepository
    );
    const product = await getProductById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, product);
  };

  getAll = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const getAllProducts = new GetAllProducts(productRepository);

    const products = await getAllProducts.execute(params.query);

    return HttpResponse.json(200, products);
  };

  create = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const createProduct = new CreateProduct(productRepository, softwareRepository);

    const product = await createProduct.execute(body);

    return HttpResponse.json(201, product);
  };

  update = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const updateProduct = new UpdateProduct(productRepository, softwareRepository);
    const product = await updateProduct.execute({
      ...body,
      id: params.params.id,
    });

    return HttpResponse.json(200, product);
  };

  addGateway = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const gatewayRepository = new GatewayRepository(this.connection);
    const addGateway = new AddGateway(productRepository, gatewayRepository);

    const Gateway = await addGateway.execute(body);

    return HttpResponse.json(201, Gateway);
  };

  updateGateway = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const gatewayRepository = new GatewayRepository(this.connection);
    const updateGateway = new UpdateGateway(productRepository, gatewayRepository);

    const Gateway = await updateGateway.execute(body);

    return HttpResponse.json(201, Gateway);
  };

  removeGateway = async (params: IParams, body: any): Promise<JsonResponse> => {
    const productRepository = new ProductRepository(this.connection);
    const gatewayRepository = new GatewayRepository(this.connection);
    const removeGateway = new RemoveGateway(productRepository, gatewayRepository);

    const Gateway = await removeGateway.execute(body);

    return HttpResponse.json(201, Gateway);
  };
}
