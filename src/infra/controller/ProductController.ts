import CreateProduct from "../../core/usecase/product/CreateProduct";
import GetAllProducts from "../../core/usecase/product/GetAllProducts";
import GetProfileById from "../../core/usecase/product/GetProductById";
import UpdateProduct from "../../core/usecase/product/UpdateProduct";
import HttpResponse from "../api/HttpResponse";
import IHttpServer, { IParams, JsonResponse } from "../api/IHttpServer";
import IConnection from "../database/IConnection";
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
  }

  getById = async (params: IParams, body: any): Promise<JsonResponse> => {
    const profileRepository = new ProductRepository(this.connection);
    const softwareRepository = new SoftwareRepository(this.connection);
    const getProfileById = new GetProfileById(profileRepository, softwareRepository);
    const profile = await getProfileById.execute({
      id: params.params.id,
    });

    return HttpResponse.json(200, profile);
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
}
