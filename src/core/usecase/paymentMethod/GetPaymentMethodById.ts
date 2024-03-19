import AppError from "../../entity/AppError";
import IPaymentMethodRepository from "../../repository/IPaymentMethodRepository";

export default class GetPaymentMethodById {
  constructor(readonly paymentMethodRepository: IPaymentMethodRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do metódo de pagamento não foi informado", 404);
    }

    const paymentMethod = await this.paymentMethodRepository.getById(input.id);

    if (!paymentMethod) {
      throw new AppError("Método de pagamento não encontrado", 404);
    }

    return {
      id: paymentMethod.id,
      description: paymentMethod.description,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  description: string;
}
