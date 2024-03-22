import AppError from "../../entity/AppError";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class GetUserTypeById {
  constructor(readonly userTypeRepository: IUserTypeRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do tipo de usuário não foi informado", 404);
    }

    const userType = await this.userTypeRepository.getById(input.id);

    if (!userType) {
      throw new AppError("Tipo de usuário não encontrado", 404);
    }

    return {
      id: userType.id,
      description: userType.description,
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
