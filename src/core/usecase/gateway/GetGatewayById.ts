import AppError from "../../entity/AppError";
import IGatewayRepository from "../../repository/IGatewayRepository";

export default class GetGatewayById {
  constructor(readonly gatewayRepository: IGatewayRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do gateway não foi informado", 404);
    }

    const gateway = await this.gatewayRepository.getById(input.id);

    if (!gateway) {
      throw new AppError("Gateway não encontrado", 404);
    }

    return {
      id: gateway.id,
      description: gateway.description,
      payment_gateway_key: gateway.payment_gateway_key,
      created_on: gateway.created_on,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  description: string;
  payment_gateway_key: string;
  created_on?: Date;
}
