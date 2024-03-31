import Gateway from "../../core/entity/Gateway";
import Product from "../../core/entity/Product";
import IProductRepository from "../../core/repository/IProductRepository";
import { GetAllDTO } from "./IGetAll";

interface ProductGateway {
  id_product: string;
  gateway: Gateway;
}

export default class ProductRepositoryMem implements IProductRepository {
  product: Product[] = [];
  productGateway: ProductGateway[] = [];

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.product,
      total: this.product.length,
      total_page: this.product.length,
    };
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.product.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Product | undefined> {
    return this.product.find((f) => f.name === name);
  }

  async save(product: Product): Promise<void> {
    this.product.push(product);
  }

  async update(product: Product): Promise<void> {
    this.product = this.product.map((i) => (i.id === product.id ? product : i));
  }

  async addGateway(id_product: string, gateway: Gateway): Promise<void> {
    this.productGateway.push({ id_product, gateway });
  }

  async updateGateway(id_product: string, gateway: Gateway): Promise<void> {
    this.productGateway = this.productGateway.map((i) =>
      i.id_product === id_product ? { id_product, gateway } : i
    );
  }

  async removeGateway(id_product: string, id_gateway: string): Promise<void> {
    this.productGateway = this.productGateway.filter(
      (i) => i.id_product !== id_product && id_gateway == id_gateway
    );
  }

  async getProductGateway(
    id_product: string,
    id_gateway: string
  ): Promise<Gateway | undefined> {
    const result = this.productGateway.find(
      (f) => f.gateway.id === id_gateway && f.id_product === id_product
    );

    return result?.gateway;
  }
}
