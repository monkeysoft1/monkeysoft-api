import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Feature from "../entity/Feature";

export default interface IFeatureRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Feature | undefined>;
  getByName(name: string): Promise<Feature | undefined>;
  save(feature: Feature): Promise<void>;
  update(software: Feature): Promise<void>;
}
