import AppError from "../entity/AppError";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class GetSoftwareById {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do software não foi informado", 404);
    }

    const software = await this.softwareRepository.getById(input.id);

    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    return {
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
      created_on: software.created_on,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}
