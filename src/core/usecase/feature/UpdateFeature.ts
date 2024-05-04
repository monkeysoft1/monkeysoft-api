import AppError from "../../entity/AppError";
import Feature from "../../entity/Feature";
import FormattedDate from "../../entity/FormattedDate";
import Utils from "../../entity/Utils";
import IFeatureRepository from "../../repository/IFeatureRepository";
import ILogRepository from "../../repository/ILogRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";
import CreateLog from "../log/CreateLog";

export default class UpdateFeature {
  constructor(
    readonly featureRepository: IFeatureRepository,
    readonly softwareRepository: ISoftwareRepository,
    readonly logRepository: ILogRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id da feature não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do feature não pode ser vazio", 400);
    }

    const feature = await this.featureRepository.getById(input.id);

    if (!feature) {
      throw new AppError("O id informado não existe", 404);
    }

    if (feature.software.id == input.id_software) Utils.hasChanges(input, feature);

    const oldFeature = {
      name: feature.name,
      active: feature.active,
      id_software: feature.software.id,
      url: feature.url,
    } as FeatureLog;

    if (input.name && input.name !== feature.name) {
      const hasFeatureByName = await this.featureRepository.getByName(input.name);

      if (hasFeatureByName) {
        throw new AppError("Já existe outra feature com o mesmo nome.", 400);
      }

      feature.name = input.name;
    }

    if (input.id_software) {
      const software = await this.softwareRepository.getById(input.id_software);
      if (!software) {
        throw new AppError("Não existe um software com o id informado", 404);
      }

      feature.software = software;
    }

    feature.description = input.description;
    feature.active = input.active;
    feature.url = input.url;
    feature.updated_on = new FormattedDate().date;

    await this.featureRepository.update(feature);

    await this.createLog(feature, oldFeature);

    return {
      id: feature.id,
      id_software: feature.software.id,
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      updated_on: feature.updated_on,
    };
  }

  private async createLog(feature: Feature, oldFeature: FeatureLog) {
    let createLog = new CreateLog(this.logRepository);

    let newFeature = {
      name: feature.name,
      active: feature.active,
      id_software: feature.software.id,
      url: feature.url,
    } as FeatureLog;

    createLog.execute({
      name_table: "feature",
      old_object: oldFeature,
      new_object: newFeature,
    });
  }
}

interface Input {
  id: string;
  id_software?: string;
  name?: string;
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
  description: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}

interface FeatureLog {
  name: string;
  active: boolean;
  id_software: string;
  url: string;
}
