import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Product from "../entity/Product";

export default interface IProductRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Product | undefined>;
  getByName(name: string): Promise<Product | undefined>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
}
