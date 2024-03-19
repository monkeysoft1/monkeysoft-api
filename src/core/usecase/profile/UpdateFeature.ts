import AppError from "../../entity/AppError";
import FormattedDate from "../../entity/FormattedDate";
import IFeatureRepository from "../../repository/IFeatureRepository";
import IProfileRepository from "../../repository/IProfileRepository";

export default class UpdateFeature {
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
      throw new AppError("Feature não encontrada", 404);
    }

    const profileFeature = await this.profileRepository.getFeatureByProfileIdAndFeatureId(
      input.id_profile,
      input.id_feature
    );

    if (!profileFeature) {
      throw new AppError("Vínculo da feature com profile não localizado.", 404);
    }

    profileFeature.read = input.read;
    profileFeature.create = input.create;
    profileFeature.update = input.update;
    profileFeature.delete = input.delete;
    profileFeature.active = input.active;
    profileFeature.updated_on = new FormattedDate().date;

    await this.profileRepository.updateFeature(input.id_profile, profileFeature);

    return {
      id_feature: profileFeature.id,
      id_profile: input.id_profile,
      read: profileFeature.read,
      create: profileFeature.create,
      update: profileFeature.update,
      delete: profileFeature.delete,
      active: profileFeature.active,
      created_on: profileFeature.created_on,
      updated_on: profileFeature.updated_on,
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
  updated_on?: Date;
}
