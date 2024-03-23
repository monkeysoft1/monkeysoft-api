import Feature from "../../core/entity/Feature";
import IFeatureRepository from "../../core/repository/IFeatureRepository";
import { GetAllDTO } from "./IGetAll";

interface ProfileFeature {
  id_profile: string;
  feature: Feature;
}

export default class FeatureRepositoryMem implements IFeatureRepository {
  feature: Feature[] = [];
  profileFeature: ProfileFeature[] = [];

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.feature,
      total: this.feature.length,
      total_page: this.feature.length,
    };
  }

  async getByProfileId(id: string): Promise<Feature[]> {
    return this.profileFeature.filter((f) => f.id_profile === id).map((i) => i.feature);
  }

  async getById(id: string): Promise<Feature | undefined> {
    return this.feature.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Feature | undefined> {
    return this.feature.find((f) => f.name === name);
  }

  async save(feature: Feature): Promise<void> {
    this.feature.push(feature);
  }

  async update(feature: Feature): Promise<void> {
    this.feature = this.feature.map((i) => (i.id === feature.id ? feature : i));
  }
}
