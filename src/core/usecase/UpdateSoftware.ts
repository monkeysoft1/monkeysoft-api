import AppError from "../entity/AppError";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class UpdateSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id?.trim()) {
      throw new AppError("O id do software não pode ser vazio", 400);
    }

    if (input.name && !input.name?.trim()) {
      throw new AppError("O nome do software não pode ser vazio", 400);
    }

    const software = await this.softwareRepository.getById(input.id);
    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    if (input.name && input.name !== software.name) {
      const hasSoftwareByName = await this.softwareRepository.getByName(
        input.name
      );

      if (hasSoftwareByName) {
        throw new AppError("Já existe outro software com o mesmo nome.", 400);
      }
      
      software.name = input.name;
    }

    software.description = input.description;
    software.active = input.active;

    console.log(software);

    await this.softwareRepository.update(software);

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
  name: string;
  description: string;
  active: boolean;
}

interface Output {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_on?: Date;
}
