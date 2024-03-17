import AppError from "../../entity/AppError";
import IFeatureRepository from "../../repository/IFeatureRepository";
import IProfileRepository from "../../repository/IProfileRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetProfileById {
  constructor(
    readonly profileRepository: IProfileRepository,
    readonly featureRepository: IFeatureRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do perfil não foi informado", 404);
    }

    const profile = await this.profileRepository.getById(input.id);

    if (!profile) {
      throw new AppError("Perfil não localizado", 404);
    }

    const software = await this.softwareRepository.getById(profile.software.id);

    let softwareDTO: SoftwareDTO | undefined = undefined;

    if (software) {
      softwareDTO = {
        id: software.id,
        name: software.name,
        description: software.description,
        active: software.active,
        created_on: software.created_on,
      };
    }

    const features = await this.featureRepository.getByProfileId(profile.id);

    const featureDTO = features.map((f) => ({
      id: f.id,
      name: f.name,
      url: f.url,
      is_page: f.is_page,
      description: f.description,
      active: f.active,
      create: f.create,
      read: f.read,
      update: f.update,
      delete: f.delete,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    return {
      id: profile.id,
      id_software: profile.software.id,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
      software: softwareDTO,
      features: featureDTO,
    };
  }
}

interface Input {
  id: string;
}

interface SoftwareDTO {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}

interface FeatureDTO {
  id: string;
  name: string;
  url: string;
  is_page: boolean;
  description: string;
  active: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  created_on?: Date;
  updated_on?: Date;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  active: boolean;
  created_on?: Date;
  software?: SoftwareDTO;
  features: FeatureDTO[];
}
