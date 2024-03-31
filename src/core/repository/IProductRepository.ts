import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Gateway from "../entity/Gateway";
import Product from "../entity/Product";

export default interface IProductRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Product | undefined>;
  getByName(name: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  addGateway(id_product: string, gateway: Gateway): Promise<void>;
  updateGateway(id_product: string, gateway: Gateway): Promise<void>;
  removeGateway(id_product: string, id_gateway: string): Promise<void>;
  getProductGateway(id_product: string, id_gateway: string): Promise<Gateway | undefined>;
}
