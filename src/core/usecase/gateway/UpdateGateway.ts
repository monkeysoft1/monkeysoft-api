import AppError from "../../entity/AppError";
import Utils from "../../entity/Utils";
import IGatewayRepository from "../../repository/IGatewayRepository";

export default class UpdateGateway {
  constructor(readonly gatewayRepository: IGatewayRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!String(input.id).trim()) {
      throw new AppError("O id do gateway não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.description)) {
      throw new AppError("A descrição do gateway não pode ser vazio", 400);
    }

    const gateway = await this.gatewayRepository.getById(input.id);

    if (!gateway) {
      throw new AppError("Gateway não encontrado", 404);
    }

    Utils.hasChanges(input, gateway);

    if (input.description && input.description !== gateway.description) {
      const hasGatewayByName = await this.gatewayRepository.getByDescription(
        input.description
      );

      if (hasGatewayByName) {
        throw new AppError("Já existe outro gateway com o mesmo nome.", 400);
      }

      gateway.description = input.description;
    }

    gateway.description = input.description;
    gateway.payment_gateway_key = input.payment_gateway_key;

    await this.gatewayRepository.update(gateway);

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
  description: string;
  payment_gateway_key?: string;
}

interface Output {
  id: string;
  description: string;
  payment_gateway_key: string;
  created_on?: Date;
}
