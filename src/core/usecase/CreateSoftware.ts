import AppError from "../entity/AppError";
import Software from "../entity/Software";
import ISoftwareRepository from "../repository/ISoftwareRepository";

export default class CreateSoftware {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input): Promise<Output> {
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
