import AppError from "../entity/AppError";
import Feature from "../entity/Feature";
import IFeatureRepository from "../repository/IFeatureRepository";

export default class CreateFeature {
  constructor(readonly featureRepository: IFeatureRepository) {}

  async execute(input: Input) {
    if (!input.name.trim()) {
      throw new AppError("O nome da feature não pode ser vazio", 400);
    }

    const hasFeature = await this.featureRepository.getByName(input.name);
    if (hasFeature) {
      throw new AppError("Feature já registrada", 400);
    }

    const feature = new Feature();
    feature.create();
    feature.name = input.name;
    feature.description = input.description;
    feature.active = Boolean(input.active);

    if (input.url) {
      feature.url = input.url;
      feature.is_page = true;
    }

    await this.featureRepository.save(feature);

    return feature;
  }
}

interface Input {
  name: string;
  url?: string;
  is_page?: boolean;
  description?: string;
  active: boolean;
}
