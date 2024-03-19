import Feature from "../../core/entity/Feature";
import Profile from "../../core/entity/Profile";
import IProfileRepository from "../../core/repository/IProfileRepository";
import { GetAllDTO } from "./IGetAll";

interface ProfileFeature {
  id_profile: string;
  feature: Feature;
}

export default class ProfileRepositoryMem implements IProfileRepository {
  profile: Profile[] = [];
  profileFeature: ProfileFeature[] = [];

  async addFeature(id_profile: string, feature: Feature): Promise<void> {
    this.profileFeature.push({ id_profile, feature });
  }

  async updateFeature(id_profile: string, feature: Feature): Promise<void> {
    this.profileFeature = this.profileFeature.map((i) =>
      i.id_profile === id_profile ? { id_profile, feature } : i
    );
  }

  async removeFeature(id_profile: string, id_feature: string): Promise<void> {
    this.profileFeature = this.profileFeature.filter((i) => i.id_profile !== id_profile);
  }

  async getFeaturesByProfileId(id: string): Promise<Feature[]> {
    const filteredProfileFeatures = this.profileFeature.filter((f) => f.id_profile === id);

    const features = filteredProfileFeatures.map((profileFeature) => profileFeature.feature);

    return features;
  }

  async getFeatureByProfileIdAndFeatureId(
    id_profile: string,
    id_feature: string
  ): Promise<Feature | undefined> {
    const result = this.profileFeature.find(
      (f) => f.feature.id === id_feature && f.id_profile === id_profile
    );

    return result?.feature;
  }

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.profile,
      total: this.profile.length,
      total_page: this.profile.length,
    };
  }

  async getById(id: string): Promise<Profile | undefined> {
    return this.profile.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Profile | undefined> {
    return this.profile.find((f) => f.name === name);
  }

  async save(profile: Profile): Promise<void> {
    this.profile.push(profile);
  }

  async update(profile: Profile): Promise<void> {
    this.profile = this.profile.map((i) => (i.id === profile.id ? profile : i));
  }
}
