import { GetAllDTO, GetAllOutputDTO } from "../../../infra/repository/IGetAll";
import Product from "../../entity/Product";
import IProductRepository from "../../repository/IProductRepository";

export default class GetAllProducts {
  constructor(readonly productRepository: IProductRepository) {}

  async execute(input: GetAllDTO): Promise<GetAllOutputDTO<ProductDTO>> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.productRepository.getAll<Product>(input);

    const products = list.map((f) => ({
      id: f.id,
      id_software: f.software.id,
      name: f.name,
      price: f.price,
      description: f.description,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    return {
      list: products,
      total,
      total_page,
    };
  }
}

interface ProductDTO {
  id: string;
  id_software: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
