import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import IGatewayRepository from "../../repository/IGatewayRepository";
import IProductRepository from "../../repository/IProductRepository";

export default class AddGateway {
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
      throw new AppError("Produto não encontrado", 404);
    }

    const gateway = await this.gatewayRepository.getById(input.id_gateway);
    if (!gateway) {
      throw new AppError("Gateway não encontrada", 404);
    }

    const productGateway = await this.productRepository.getProductGateway(
      input.id_product,
      input.id_gateway
    );

    if (productGateway) {
      throw new AppError("Vínculo da gateway com o produto já existe.", 404);
    }

    gateway.id_gateway_product = input.id_gateway_product;
    gateway.active = input.active;
    gateway.created_on = new FormattedDate().date;

    await this.productRepository.addGateway(input.id_product, gateway);

    return {
      id_product: product.id,
      id_gateway: gateway.id,
      id_gateway_product: gateway.id_gateway_product,
      active: gateway.active,
      created_on: gateway.created_on,
    };
  }
}

interface Input {
  id_gateway: string;
  id_product: string;
  id_gateway_product: string;
  active: boolean;
}

interface Output {
  id_gateway: string;
  id_product: string;
  id_gateway_product: string;
  active: boolean;
  created_on?: Date;
}
