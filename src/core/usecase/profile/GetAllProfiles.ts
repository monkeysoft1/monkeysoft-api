import { GetAllDTO, GetAllOutputDTO } from "../../../infra/repository/IGetAll";
import Profile from "../../entity/Profile";
import IProfileRepository from "../../repository/IProfileRepository";

export default class GetAllProfiles {
  constructor(readonly profileRepository: IProfileRepository) {}

  async execute(input: GetAllDTO): Promise<GetAllOutputDTO<ProfileDTO>> {
    const filters = {
      name: input.name,
      active: input.active,
      id_software: input.id_software,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.profileRepository.getAll<Profile>(input);

    const profiles = list.map((f) => ({
      id: f.id,
      id_software: f.software.id,
      name: f.name,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    return {
      list: profiles,
      total,
      total_page,
    };
  }
}

interface ProfileDTO {
  id: string;
  id_software: string;
  name: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
