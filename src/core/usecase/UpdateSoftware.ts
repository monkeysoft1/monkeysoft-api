import AppError from "../entity/AppError";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class UpdateSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input) {
    if (!input.id?.trim()) {
      throw new AppError("O id do software não pode ser vazio", 400);
    }

    if (!input.name?.trim()) {
      throw new AppError("O nome do software não pode ser vazio", 400);
    }

    const software = await this.softwareRepository.getById(input.id);
    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    if (software.name != input.name) {
      const hasSoftwareByName = await this.softwareRepository.getByName(
        input.name
      );

      if (hasSoftwareByName) {
        throw new AppError("Já existe outro software com o mesmo nome.", 400);
      }
    }

    software.name = input.name;
    software.description = input.description;
    software.active = input.active;

    await this.softwareRepository.update(software);

    return software;
  }
}

interface Input {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}
