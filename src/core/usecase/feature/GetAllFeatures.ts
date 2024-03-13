import { GetAllDTO, GetAllOutputDTO } from "../../../infra/repository/IGetAll";
import Feature from "../../entity/Feature";
import IFeatureRepository from "../../repository/IFeatureRepository";

export default class GetAllFeatures {
  constructor(readonly featureRepository: IFeatureRepository) {}

  async execute(input: GetAllDTO): Promise<GetAllOutputDTO<FeatureDTO>> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.featureRepository.getAll<Feature>(input);

    const features = list.map((f) => ({
      id: f.id,
      id_software: f.id_software,
      name: f.name,
      url: f.url,
      is_page: f.is_page,
      description: f.description,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    return {
      list: features,
      total,
      total_page,
    };
  }
}

interface FeatureDTO {
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
