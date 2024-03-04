import Feature from "../../core/entity/Feature";
import IFeatureRepository from "../../core/repository/IFeatureRepository";

export default class FeatureRepositoryMem implements IFeatureRepository {
  feature: Feature[] = [];

  async getByName(name: string): Promise<Feature | undefined> {
    const feature = this.feature.find((f) => f.name === name);
    if (feature) {
      return feature;
    }
  }
  async save(feature: Feature): Promise<void> {
    this.feature.push(feature);
  }
}
