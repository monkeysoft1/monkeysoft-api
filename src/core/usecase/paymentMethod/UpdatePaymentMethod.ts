import AppError from "../../entity/AppError";
import Utils from "../../entity/Utils";
import IPaymentMethodRepository from "../../repository/IPaymentMethodRepository";

export default class UpdatePaymentMethod {
  constructor(readonly paymentMethodRepository: IPaymentMethodRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.id, true)) {
      throw new AppError("O id do método de pagamento não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.description, true)) {
      throw new AppError("A descrição do método de pagamento não pode ser vazio", 400);
    }

    const paymentMethod = await this.paymentMethodRepository.getById(input.id);

    if (!paymentMethod) {
      throw new AppError("Método de pagamento não encontrado", 404);
    }

    Utils.hasChanges(input, paymentMethod);

    if (input.description && input.description !== paymentMethod.description) {
      const hasPaymentMethodByName = await this.paymentMethodRepository.getByDescription(
        input.description
      );

      if (hasPaymentMethodByName) {
        throw new AppError("Já existe outro paymentMethod com o mesmo nome.", 400);
      }

      paymentMethod.description = input.description;
    }

    paymentMethod.description = input.description;

    await this.paymentMethodRepository.update(paymentMethod);

    return {
      id: paymentMethod.id,
      description: paymentMethod.description,
    };
  }
}

interface Input {
  id: string;
  description: string;
}

interface Output {
  id: string;
  description: string;
}
