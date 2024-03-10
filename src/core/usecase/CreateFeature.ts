import AppError from '../entity/AppError';
import Feature from '../entity/Feature';
import IFeatureRepository from '../repository/IFeatureRepository';
import ISoftwareRepository from '../repository/ISoftwareRepository';

export default class CreateFeature {
  constructor(readonly featureRepository: IFeatureRepository,readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id_software?.trim()) {
      throw new AppError('O id_software não pode ser vazio', 400);
    }

    const feature = new Feature();
    feature.create();
    feature.name = input.name;
    feature.description = input.description;
    feature.active = input.active;
    feature.url = input.url;

    const hasFeature = await this.featureRepository.getByName(feature.name);
    if (hasFeature) {
      throw new AppError('Feature já registrada', 400);
    }

    const software = await this.softwareRepository.getById(input.id_software);
    if (!software) {
      throw new AppError('Software não encontrado', 404);
    }

    feature.id_software = input.id_software;

    await this.featureRepository.save(feature);

    return {
      id: feature.id,
      id_software: feature.id_software,
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      updated_on: feature.updated_on,
    };
  }
}

interface Input {
  id_software?: string;
  name: string;
  url?: string;
  description?: string;
  active?: boolean;
}

interface Output {
  id: string;
  id_software: string;
  name: string;
  url: string;
  is_page: boolean;
  description?: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
