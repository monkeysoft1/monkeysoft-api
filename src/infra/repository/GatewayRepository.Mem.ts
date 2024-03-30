import Gateway from "../../core/entity/Gateway";
import IGatewayRepository from "../../core/repository/IGatewayRepository";
import { GetAllDTO } from "./IGetAll";

interface ProductGateway {
  id_product: string;
  gateway: Gateway;
}

export default class GatewayRepositoryMem implements IGatewayRepository {
  gateway: Gateway[] = [];
  productGateway: ProductGateway[] = [];

  async getByProductId(id_product: string): Promise<Gateway[]> {
    return this.productGateway
      .filter((f) => f.id_product === id_product)
      .map((i) => i.gateway);
  }

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.gateway,
      total: this.gateway.length,
      total_page: this.gateway.length,
    };
  }

  async getById(id: string): Promise<Gateway | undefined> {
    return this.gateway.find((f) => f.id === id);
  }

  async getByDescription(description: string): Promise<Gateway | undefined> {
    return this.gateway.find((f) => f.description === description);
  }

  async save(gateway: Gateway): Promise<void> {
    this.gateway.push(gateway);
  }

  async update(gateway: Gateway): Promise<void> {
    this.gateway = this.gateway.map((i) => (i.id === gateway.id ? gateway : i));
  }
}
