import { GetAllDTO } from "../../../infra/repository/IGetAll";
import Gateway from "../../entity/Gateway";
import IGatewayRepository from "../../repository/IGatewayRepository";

export default class GetAllGateways {
  constructor(readonly gatewayRepository: IGatewayRepository) {}

  async execute(input: GetAllDTO): Promise<Output> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.gatewayRepository.getAll<Gateway>(input);

    const gateways = list.map((f: Gateway) => ({
      id: f.id,
      description: f.description,
      payment_gateway_key: f.payment_gateway_key,
      created_on: f.created_on,
    }));

    return {
      list: gateways,
      total,
      total_page,
    };
  }
}

interface GatewayDTO {
  id: string;
  description: string;
  payment_gateway_key: string;
  created_on?: Date;
}

interface Output {
  list: GatewayDTO[];
  total: number;
  total_page: number;
}
