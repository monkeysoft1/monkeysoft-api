import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import Utils from "../../entity/Utils";
import IProductRepository from "../../repository/IProductRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class UpdateProduct {
  constructor(
    readonly productRepository: IProductRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do produto não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do produto não pode ser vazio", 400);
    }

    const product = await this.productRepository.getById(input.id);

    if (!product) {
      throw new AppError("O id informado não existe", 404);
    }

    Utils.hasChanges(input, product);

    if (input.name && input.name !== product.name) {
      const hasProductByName = await this.productRepository.getByName(input.name);

      if (hasProductByName) {
        throw new AppError("Já existe outro produto com o mesmo nome.", 400);
      }

      product.name = input.name;
    }

    if (input.id_software) {
      const software = await this.softwareRepository.getById(input.id_software);
      if (!software) {
        throw new AppError("Não existe um software com o id informado", 404);
      }

      product.software = software;
    }

    product.description = input.description;
    product.active = input.active;
    product.price = input.price;
    product.updated_on = new FormattedDate().date;

    await this.productRepository.update(product);

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
  id: string;
  id_software?: string;
  name?: string;
  price?: number;
  description?: string;
  active?: boolean;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
