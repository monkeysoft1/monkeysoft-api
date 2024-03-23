import AppError from "../../entity/AppError";
import Product from "../../entity/Product";
import Utils from "../../entity/Utils";
import IProductRepository from "../../repository/IProductRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class CreateProduct {
  constructor(
    readonly productRepository: IProductRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id_software?.trim()) {
      throw new AppError("O id_software não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name, true)) {
      throw new AppError("O nome do produto não pode ser vazio", 400);
    }

    const product = new Product();
    product.name = input.name;
    product.description = input.description;
    product.active = input.active;
    product.price = input.price;

    const hasProduct = await this.productRepository.getByName(product.name);
    if (hasProduct) {
      throw new AppError("Produto já registrado anteriormente", 400);
    }

    const software = await this.softwareRepository.getById(input.id_software);
    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    product.software = software;

    await this.productRepository.save(product);

    return {
      id: product.id,
      id_software: product.software.id,
      name: product.name,
      price: product.price,
      description: product.description,
      active: product.active,
      created_on: product.created_on,
      updated_on: product.updated_on,
    };
  }
}

interface Input {
  id_software?: string;
  name: string;
  price?: number;
  description?: string;
  active?: boolean;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  price: number;
  description?: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
