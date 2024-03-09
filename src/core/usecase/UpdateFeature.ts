import AppError from "../entity/AppError";
import IFeatureRepository from "../repository/IFeatureRepository";

export default class UpdateFeature {
  constructor(readonly featureRepository: IFeatureRepository) {}

  async execute(input: Input) {
    if (!input.id?.trim()) {
      throw new AppError("O id da feature não pode ser vazio", 400);
    }

    if (!input.name?.trim()) {
      throw new AppError("O nome da feature não pode ser vazio", 400);
    }

    const feature = await this.featureRepository.getById(input.id);

    if (!feature) {
      throw new AppError("O id informado não existe", 404);
    }

    if (feature.name != input.name) {
      const hasFeatureByName = await this.featureRepository.getByName(
        input.name
      );

      if (hasFeatureByName) {
        throw new AppError("Já existe outra feature com o mesmo nome.", 400);
      }
    }

    feature.name = input.name;
    feature.description = input.description;
    feature.active = input.active;
    feature.url = input.url;
    feature.active = input.active;

    if (feature.url) {
      feature.is_page = true;
    }

    await this.featureRepository.update(feature);

    return feature;
  }
}

interface Input {
  id: string;
  name: string;
  url?: string;
  is_page?: boolean;
  description?: string;
  active: boolean;
}
