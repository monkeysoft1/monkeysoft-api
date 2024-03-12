import Feature from "../entity/Feature";
import IFeatureRepository from "../repository/IFeatureRepository";

export default class GetAllFeatures {
  constructor(readonly featureRepository: IFeatureRepository) {}

  async execute(input: GetAllFeaturesDTO): Promise<Output> {
    //busca os dados
    const { list, total, total_page } = await this.featureRepository.getAll(input);

    //mapeia os campos para passar pra proxima camada e remover os "_"
    const features = list.map((f: Feature) => ({
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

    //retorna os campos list,total,total_page por padrão
    return {
      list: features,
      total,
      total_page,
    };
  }
}

export interface GetAllFeaturesDTO {
  //defina os campos que deseja ter como filtro
  name?: string;
  active?: boolean;

  //campos default
  order?: string;
  orderBy?: string;
  page?: number;
  all?: boolean;
}

interface FeatureDTO {
  id: string;
  id_software: string;
  name: string;
  url: string;
  is_page: boolean;
  description: string;
  active: boolean;
  created_on: Date;
  updated_on: Date;
}

interface Output {
  list: FeatureDTO[];
  total: number;
  total_page: number;
}
