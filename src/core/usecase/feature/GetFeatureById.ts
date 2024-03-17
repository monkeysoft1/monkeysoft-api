import AppError from "../../entity/AppError";
import IFeatureRepository from "../../repository/IFeatureRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetFeatureById {
  constructor(
    readonly featureRepository: IFeatureRepository,
    readonly softwareRepository: ISoftwareRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do feature não foi informado", 404);
    }

    const feature = await this.featureRepository.getById(input.id);

    if (!feature) {
      throw new AppError("Feature não encontrada", 404);
    }

    const software = await this.softwareRepository.getById(feature.software.id);

    let softwareDTO;

    if (software) {
      softwareDTO = {
        id: software.id,
        name: software.name,
        description: software.description,
        active: software.active,
        created_on: software.created_on,
      };
    }

    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      software: softwareDTO,
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

interface Output {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
  software?: SoftwareDTO;
}
