import Feature from "../../core/entity/Feature";
import IFeatureRepository from "../../core/repository/IFeatureRepository";

export default class FeatureRepositoryMem implements IFeatureRepository {
  feature: Feature[] = [];

  async getById(id: string): Promise<Feature | undefined> {
    const feature = this.feature.find((f) => f.id === id);
    if (feature) {
      return feature;
    }
  }

  async getByName(name: string): Promise<Feature | undefined> {
    const feature = this.feature.find((f) => f.name === name);
    if (feature) {
      return feature;
    }
  }

  async save(feature: Feature): Promise<void> {
    this.feature.push(feature);
  }

  async update(feature: Feature): Promise<void> {
    const index = this.feature.findIndex((x) => x.id === feature.id);
    if (index) {
      this.feature[index] = feature;
    }
  }
}
