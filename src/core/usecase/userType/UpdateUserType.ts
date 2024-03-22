import AppError from "../../entity/AppError";
import Utils from "../../entity/Utils";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class UpdateUserType {
  constructor(readonly userTypeRepository: IUserTypeRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.id, true)) {
      throw new AppError("O id do método de pagamento não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.description, true)) {
      throw new AppError("A descrição do método de pagamento não pode ser vazio", 400);
    }

    const userType = await this.userTypeRepository.getById(input.id);

    if (!userType) {
      throw new AppError("Tipo de usuário não encontrado", 404);
    }

    Utils.hasChanges(input, userType);

    if (input.description && input.description !== userType.description) {
      const hasUserTypeByName = await this.userTypeRepository.getByDescription(
        input.description
      );

      if (hasUserTypeByName) {
        throw new AppError("Já existe outro userType com o mesmo nome.", 400);
      }

      userType.description = input.description;
    }

    userType.description = input.description;

    await this.userTypeRepository.update(userType);

    return {
      id: userType.id,
      description: userType.description,
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
