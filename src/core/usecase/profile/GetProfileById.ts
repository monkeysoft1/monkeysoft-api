import AppError from "../../entity/AppError";
import IProfileRepository from "../../repository/IProfileRepository";

export default class GetProfileById {
  constructor(readonly profileRepository: IProfileRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do perfil não foi informado", 404);
    }

    const profile = await this.profileRepository.getById(input.id);

    if (!profile) {
      throw new AppError("Perfil não localizado", 404);
    }

    return {
      id: profile.id,
      id_software: profile.id_software,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  active: boolean;
  created_on?: Date;
}
