import AppError from "../../entity/AppError";
import IProductRepository from "../../repository/IProductRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetProductById {
  constructor(
    readonly productRepository: IProductRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do product não foi informado", 404);
    }

    const product = await this.productRepository.getById(input.id);

    if (!product) {
      throw new AppError("Product não encontrada", 404);
    }

    const software = await this.softwareRepository.getById(product.software.id);

    let softwareDTO;

    if (software) {
      softwareDTO = {
        id: software.id,
        name: software.name,
        description: software.description,
        active: software.active,
        created_on: software.created_on,
      };
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      active: product.active,
      created_on: product.created_on,
      software: softwareDTO,
    };
  }
}

interface Input {
  id: string;
}

interface SoftwareDTO {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}

interface Output {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  created_on?: Date;
  software?: SoftwareDTO;
}
