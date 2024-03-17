import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import Utils from "../../entity/Utils";
import IProfileRepository from "../../repository/IProfileRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class UpdateProfile {
  constructor(
    readonly profileRepository: IProfileRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do perfil não pode ser vazio", 400);
    }

    console.log("Chegou antes da validação");

    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do perfil não pode ser vazio", 400);
    }

    const profile = await this.profileRepository.getById(input.id);

    if (!profile) {
      throw new AppError("O id informado não existe", 404);
    }

    Utils.hasChanges(input, profile);

    if (input.name && input.name !== profile.name) {
      const hasProfileByName = await this.profileRepository.getByName(input.name);

      if (hasProfileByName) {
        throw new AppError("Já existe outro perfil com o mesmo nome.", 400);
      }

      profile.name = input.name;
    }

    if (input.id_software) {
      const software = await this.softwareRepository.getById(input.id_software);
      console.log("Fez consulta");
      if (!software) {
        throw new AppError("Não existe um software com o id informado", 404);
      }

      profile.software = software;
    }

    profile.active = input.active;
    profile.updated_on = new FormattedDate().date;

    await this.profileRepository.update(profile);

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
  id: string;
  id_software?: string;
  name?: string;
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
