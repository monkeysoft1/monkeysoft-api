import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import IFeatureRepository from "../../repository/IFeatureRepository";
import IProfileRepository from "../../repository/IProfileRepository";

export default class AddFeature {
  constructor(
    readonly profileRepository: IProfileRepository,
    readonly featureRepository: IFeatureRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id_feature?.trim()) {
      throw new AppError("O id_feature não pode ser vazio", 400);
    }

    if (!input.id_profile?.trim()) {
      throw new AppError("O id_profile não pode ser vazio", 400);
    }

    const profile = await this.profileRepository.getById(input.id_profile);
    if (!profile) {
      throw new AppError("Perfil não encontrado", 404);
    }

    const feature = await this.featureRepository.getById(input.id_feature);
    if (!feature) {
      throw new AppError("Feature não encontrado", 404);
    }

    feature.read = input.read;
    feature.create = input.create;
    feature.update = input.update;
    feature.delete = input.delete;
    feature.active = input.active;
    feature.created_on = new FormattedDate().date;

    await this.profileRepository.addFeature(input.id_profile, feature);

    return {
      id_feature: feature.id,
      id_profile: input.id_profile,
      read: feature.read,
      create: feature.create,
      update: feature.update,
      delete: feature.delete,
      active: feature.active,
      created_on: feature.created_on,
    };
  }
}

interface Input {
  id_feature: string;
  id_profile: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  active: boolean;
}

interface Output {
  id_feature: string;
  id_profile: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  active: boolean;
  created_on?: Date;
}
