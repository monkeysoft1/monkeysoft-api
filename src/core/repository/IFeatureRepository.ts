import Feature from "../entity/Feature";
import { GetAllFeaturesDTO } from "../usecase/GetAllFeatures";

export default interface IFeatureRepository {
  getAll(input: GetAllFeaturesDTO): Promise<any>;
  getById(id: string): Promise<Feature | undefined>;
  getByName(name: string): Promise<Feature | undefined>;
  save(feature: Feature): Promise<void>;
  update(software: Feature): Promise<void>;
}
