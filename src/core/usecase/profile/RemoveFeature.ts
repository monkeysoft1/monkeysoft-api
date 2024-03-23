import AppError from "../../entity/AppError";
import IFeatureRepository from "../../repository/IFeatureRepository";
import IProfileRepository from "../../repository/IProfileRepository";

export default class RemoveFeature {
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

    const profileFeature = await this.profileRepository.getFeaturePermission(
      input.id_profile,
      input.id_feature
    );

    if (!profileFeature) {
      throw new AppError("Vínculo da feature com profile não localizado.", 404);
    }

    await this.profileRepository.removeFeature(input.id_profile, input.id_feature);

    return { message: "Feature removida do perfil com sucesso" };
  }
}

interface Input {
  id_feature: string;
  id_profile: string;
}

interface Output {
  message: string;
}
