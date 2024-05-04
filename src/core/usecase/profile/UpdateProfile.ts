import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import Profile from "../../entity/Profile";
import Utils from "../../entity/Utils";
import ILogRepository from "../../repository/ILogRepository";
import IProfileRepository from "../../repository/IProfileRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";
import CreateLog from "../log/CreateLog";

export default class UpdateProfile {
  constructor(
    readonly profileRepository: IProfileRepository,
    readonly softwareRepository: ISoftwareRepository,
    readonly logRepository: ILogRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do perfil não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do perfil não pode ser vazio", 400);
    }

    const profile = await this.profileRepository.getById(input.id);

    if (!profile) {
      throw new AppError("O id informado não existe", 404);
    }

    if (profile.software.id == input.id_software) Utils.hasChanges(input, profile);

    const oldProfile = {
      name: profile.name,
      active: profile.active,
      id_software: profile.software.id,
    } as ProfileLog;

    if (input.name && input.name !== profile.name) {
      const hasProfileByName = await this.profileRepository.getByName(input.name);

      if (hasProfileByName) {
        throw new AppError("Já existe outro perfil com o mesmo nome.", 400);
      }

      profile.name = input.name;
    }

    if (input.id_software) {
      const software = await this.softwareRepository.getById(input.id_software);
      if (!software) {
        throw new AppError("Não existe um software com o id informado", 404);
      }

      profile.software = software;
    }

    profile.active = input.active;
    profile.updated_on = new FormattedDate().date;

    await this.profileRepository.update(profile);

    await this.createLog(profile, oldProfile);

    return {
      id: profile.id,
      id_software: profile.software.id,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
      updated_on: profile.updated_on,
    };
  }

  private async createLog(profile: Profile, oldProfile: ProfileLog) {
    let createLog = new CreateLog(this.logRepository);

    let newProfile = {
      name: profile.name,
      active: profile.active,
      id_software: profile.software.id,
    } as ProfileLog;

    createLog.execute({
      name_table: "profile",
      old_object: oldProfile,
      new_object: newProfile,
    });
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

interface ProfileLog {
  name: string;
  active: boolean;
  id_software: string;
}
