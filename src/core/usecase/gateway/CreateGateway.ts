import AppError from "../../entity/AppError";
import Gateway from "../../entity/Gateway";
import Utils from "../../entity/Utils";
import IGatewayRepository from "../../repository/IGatewayRepository";

export default class CreateGateway {
  constructor(readonly gatewayRepository: IGatewayRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.description)) {
      throw new AppError("A descrição do gateway não pode ser vazio", 400);
    }

    const gateway = new Gateway();
    gateway.description = input.description;
    gateway.payment_gateway_key = input.payment_gateway_key;

    const hasGateway = await this.gatewayRepository.getByDescription(input.description);

    if (hasGateway) {
      throw new AppError("Gateway já registrado", 400);
    }

    await this.gatewayRepository.save(gateway);

    return {
      id: gateway.id,
      description: gateway.description,
      payment_gateway_key: gateway.payment_gateway_key,
      created_on: gateway.created_on,
    };
  }
}

interface Input {
  description: string;
  payment_gateway_key?: string;
}
interface Output {
  id: string;
  description: string;
  payment_gateway_key: string;
  created_on?: Date;
}
