import Feature from "../entity/Feature";

export default interface IFeatureRepository {
  getByName(name: string): Promise<Feature | undefined>;
  save(feature: Feature): Promise<void>;
}
