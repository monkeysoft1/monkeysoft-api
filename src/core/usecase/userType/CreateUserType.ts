import AppError from "../../entity/AppError";
import UserType from "../../entity/UserType";
import Utils from "../../entity/Utils";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class CreateUserType {
  constructor(readonly userTypeRepository: IUserTypeRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.description, true)) {
      throw new AppError("O descrição do tipo de usuário não pode ser vazio", 400);
    }

    const userType = new UserType();
    userType.description = input.description;

    const hasUserType = await this.userTypeRepository.getByDescription(
      input.description
    );

    if (hasUserType) {
      throw new AppError("Tipo de usuário já registrado", 400);
    }

    await this.userTypeRepository.save(userType);

    return {
      id: userType.id,
      description: userType.description,
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
