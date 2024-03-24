import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import IGatewayRepository from "../../repository/IGatewayRepository";
import IProductRepository from "../../repository/IProductRepository";

export default class UpdateGateway {
  constructor(
    readonly productRepository: IProductRepository,
    readonly gatewayRepository: IGatewayRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id_gateway?.trim()) {
      throw new AppError("O id_gateway não pode ser vazio", 400);
    }

    if (!input.id_product?.trim()) {
      throw new AppError("O id_product não pode ser vazio", 400);
    }

    const product = await this.productRepository.getById(input.id_product);
    if (!product) {
      throw new AppError("Perfil não encontrado", 404);
    }

    const gateway = await this.gatewayRepository.getById(input.id_gateway);
    if (!gateway) {
      throw new AppError("Gateway não encontrada", 404);
    }

    const productGateway = await this.productRepository.getProductGateway(
      input.id_product,
      input.id_gateway
    );

    if (!productGateway) {
      throw new AppError("Vínculo de produto com gateway não localizado.", 404);
    }

    productGateway.id_gateway_product = input.id_gateway_product;
    productGateway.active = input.active;
    productGateway.updated_on = new FormattedDate().date;

    await this.productRepository.updateGateway(input.id_product, productGateway);

    return {
      id_gateway: productGateway.id,
      id_product: input.id_product,
      id_gateway_product: productGateway.id_gateway_product,
      active: productGateway.active,
      created_on: productGateway.created_on,
      updated_on: productGateway.updated_on,
    };
  }
}

interface Input {
  id_product: string;
  id_gateway: string;
  id_gateway_product: string;
  active: boolean;
}

interface Output {
  id_product: string;
  id_gateway: string;
  id_gateway_product: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
