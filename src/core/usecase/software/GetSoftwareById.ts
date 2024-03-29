import { GetAllDTO } from "../../../infra/repository/IGetAll";
import AppError from "../../entity/AppError";
import IFeatureRepository from "../../repository/IFeatureRepository";
import IProductRepository from "../../repository/IProductRepository";
import IProfileRepository from "../../repository/IProfileRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetSoftwareById {
  constructor(
    readonly softwareRepository: ISoftwareRepository,
    readonly profileRepository: IProfileRepository,
    readonly featureRepository: IFeatureRepository,
    readonly productRepository: IProductRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do software não foi informado", 404);
    }

    const software = await this.softwareRepository.getById(input.id);

    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    const getAllInput: GetAllDTO = {
      id_software: software.id,
      filters: { id_software: software.id },
    };

    const { list: profilesResult } = await this.profileRepository.getAll(getAllInput);
    const { list: featuresResult } = await this.featureRepository.getAll(getAllInput);
    const { list: productsResult } = await this.productRepository.getAll(getAllInput);

    console.log(featuresResult);

    const profiles: ProfileDTO[] = profilesResult.map((f: any) => ({
      id: f.id,
      name: f.name,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    const features: FeatureDTO[] = featuresResult.map((f: any) => ({
      id: f.id,
      name: f.name,
      url: f.url,
      is_page: f.is_page,
      description: f.description,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    const products: ProductDTO[] = productsResult.map((f: any) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      price: f.price,
      active: f.active,
      created_on: f.created_on,
      updated_on: f.updated_on,
    }));

    return {
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
      created_on: software.created_on,
      profiles,
      features,
      products,
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
  features: any[];
  profiles: any[];
  products: any[];
}

interface ProfileDTO {
  id: string;
  name: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}

interface FeatureDTO {
  id: string;
  name: string;
  url: string;
  is_page: boolean;
  description: string;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}

interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  created_on?: Date;
  updated_on?: Date;
}
