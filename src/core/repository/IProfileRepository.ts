import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Feature from "../entity/Feature";
import Profile from "../entity/Profile";

export default interface IProfileRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Profile | undefined>;
  getByName(name: string): Promise<Profile | undefined>;
  save(profile: Profile): Promise<void>;
  update(profile: Profile): Promise<void>;
  addFeature(id_profile: string, feature: Feature): Promise<void>;
  updateFeature(id_profile: string, feature: Feature): Promise<void>;
  removeFeature(id_profile: string, id_feature: string): Promise<void>;
  getFeaturesByProfileId(id: string): Promise<Feature[]>;
  getFeatureByProfileIdAndFeatureId(
    id_profile: string,
    id_feature: string
  ): Promise<Feature | undefined>;
}
