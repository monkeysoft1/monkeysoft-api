import AppError from "../../entity/AppError";
import IFeatureRepository from "../../repository/IFeatureRepository";

export default class GetFeatureById {
  constructor(readonly featureRepository: IFeatureRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do feature não foi informado", 404);
    }

    const feature = await this.featureRepository.getById(input.id);

    if (!feature) {
      throw new AppError("Feature não encontrado", 404);
    }

    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
    };
  }
}

interface Input {
  id: string;
}

interface Output {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}
