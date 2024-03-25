import AppError from "../../entity/AppError";
import IGatewayRepository from "../../repository/IGatewayRepository";
import IProductRepository from "../../repository/IProductRepository";

export default class RemoveGateway {
  constructor(
    readonly productRepository: IProductRepository,
    readonly gatewayRepository: IGatewayRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id?.trim()) {
      throw new AppError("O id não pode ser vazio", 400);
    }

    if (!input.id_gateway?.trim()) {
      throw new AppError("O id_gateway não pode ser vazio", 400);
    }

    const product = await this.productRepository.getById(input.id);
    if (!product) {
      throw new AppError("Produto não localizado", 404);
    }

    const gateway = await this.gatewayRepository.getById(input.id_gateway);
    if (!gateway) {
      throw new AppError("Gateway não localizado", 404);
    }

    const productGateway = await this.productRepository.getProductGateway(
      input.id,
      input.id_gateway
    );

    if (!productGateway) {
      throw new AppError("Vínculo do Produto com Gateway não localizado.", 404);
    }

    await this.productRepository.removeGateway(input.id, input.id_gateway);

    return { message: "Gateway removido do Produto com sucesso." };
  }
}

interface Input {
  id: string;
  id_gateway: string;
}

interface Output {
  message: string;
}
