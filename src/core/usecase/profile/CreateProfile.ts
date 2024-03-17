import AppError from "../../entity/AppError";
import Profile from "../../entity/Profile";
import Utils from "../../entity/Utils";
import IProfileRepository from "../../repository/IProfileRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class CreateProfile {
  constructor(
    readonly profileRepository: IProfileRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id_software?.trim()) {
      throw new AppError("O id do software não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name, true)) {
      throw new AppError("O nome do perfil não pode ser vazio", 400);
    }

    const profile = new Profile();
    profile.name = input.name;
    profile.active = input.active;

    const hasProfile = await this.profileRepository.getByName(profile.name);
    if (hasProfile) {
      throw new AppError("Perfil já registrado", 400);
    }

    const software = await this.softwareRepository.getById(input.id_software);
    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    profile.software = software;

    await this.profileRepository.save(profile);

    return {
      id: profile.id,
      id_software: profile.software.id,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
      updated_on: profile.updated_on,
    };
  }
}

interface Input {
  id_software?: string;
  name: string;
  active?: boolean;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
