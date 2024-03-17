import AppError from "../../entity/AppError";
import PaymentMethod from "../../entity/PaymentMethod";
import Utils from "../../entity/Utils";
import IPaymentMethodRepository from "../../repository/IPaymentMethodRepository";

export default class CreatePaymentMethod {
  constructor(readonly paymentMethodRepository: IPaymentMethodRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.description, true)) {
      throw new AppError("A descrição do método de pagamento não pode ser vazio", 400);
    }

    const paymentMethod = new PaymentMethod();
    paymentMethod.description = input.description;

    const hasPaymentMethod = await this.paymentMethodRepository.getByDescription(input.description);

    if (hasPaymentMethod) {
      throw new AppError("Método de pagamento já registrado", 400);
    }

    await this.paymentMethodRepository.save(paymentMethod);

    return {
      id: paymentMethod.id,
      description: paymentMethod.description,
    };
  }
}

interface Input {
  description: string;
}
interface Output {
  id: string;
  description: string;
}
