import AppError from "../../entity/AppError";
import Software from "../../entity/Software";
import Utils from "../../entity/Utils";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class CreateSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do software não pode ser vazio", 400);
    }

    const software = new Software();
    software.create();
    software.name = input.name;
    software.description = input.description;
    software.active = input.active;

    const hasSoftware = await this.softwareRepository.getByName(input.name);

    if (hasSoftware) {
      throw new AppError("Software já registrado", 400);
    }

    await this.softwareRepository.save(software);

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
  name: string;
  description?: string;
  active?: boolean;
}
interface Output {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}
