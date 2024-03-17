import { GetAllDTO } from "../../../infra/repository/IGetAll";
import PaymentMethod from "../../entity/PaymentMethod";
import IPaymentMethodRepository from "../../repository/IPaymentMethodRepository";

export default class GetAllPaymentMethods {
  constructor(readonly paymentMethodRepository: IPaymentMethodRepository) {}

  async execute(input: GetAllDTO): Promise<Output> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.paymentMethodRepository.getAll<PaymentMethod>(input);

    const paymentMethods = list.map((f: PaymentMethod) => ({
      id: f.id,
      description: f.description
    }));

    return {
      list: paymentMethods,
      total,
      total_page,
    };
  }
}

interface PaymentMethodDTO {
  id: string;
  description: string;
}

interface Output {
  list: PaymentMethodDTO[];
  total: number;
  total_page: number;
}
