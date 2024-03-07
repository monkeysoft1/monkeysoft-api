import AppError from "../entity/AppError";
import Software from "../entity/Software";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class CreateSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input) {
    if (!input.name.trim()) {
      throw new AppError("O nome do software não pode ser vazio", 400);
    }

    const hasSoftware = await this.softwareRepository.getByName(input.name);

    if (hasSoftware) {
      throw new AppError("Software já registrado", 400);
    }

    const software = new Software();
    software.create();
    software.name = input.name;
    software.description = input.description;
    software.active = Boolean(input.active);

    await this.softwareRepository.save(software);

    return software;
  }
}

interface Input {
  name: string;
  description?: string;
  active: boolean;
}
