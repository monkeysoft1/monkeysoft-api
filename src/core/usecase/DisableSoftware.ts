import AppError from "../entity/AppError";
import Software from "../entity/Software";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class DisableSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input) {
    if (!input.id.trim()) {
      throw new AppError("O id do software não pode ser vazio", 400);
    }

    const softwareById = await this.softwareRepository.getById(input.id);

    if (!softwareById) throw new AppError("O id informado não existe", 400);

    const software = new Software();
    software.id = input.id;
    software.active = false;

    await this.softwareRepository.update(software);

    return software;
  }
}

interface Input {
  id: string;
}
