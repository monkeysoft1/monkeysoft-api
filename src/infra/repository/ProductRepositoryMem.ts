import Product from "../../core/entity/Product";
import IProductRepository from "../../core/repository/IProductRepository";
import { GetAllDTO } from "./IGetAll";

interface ProfileProduct {
  id_profile: string;
  feature: Product;
}

export default class ProductRepositoryMem implements IProductRepository {
  feature: Product[] = [];
  profileProduct: ProfileProduct[] = [];

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.feature,
      total: this.feature.length,
      total_page: this.feature.length,
    };
  }

  async getByProfileId(id: string): Promise<Product[]> {
    return this.profileProduct.filter((f) => f.id_profile === id).map((i) => i.feature);
  }

  async getById(id: string): Promise<Product | undefined> {
    return this.feature.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Product | undefined> {
    return this.feature.find((f) => f.name === name);
  }

  async save(feature: Product): Promise<void> {
    this.feature.push(feature);
  }

  async update(feature: Product): Promise<void> {
    this.feature = this.feature.map((i) => (i.id === feature.id ? feature : i));
  }
}
