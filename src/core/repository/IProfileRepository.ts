import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Profile from "../entity/Profile";

export default interface IProfileRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Profile | undefined>;
  getByName(name: string): Promise<Profile | undefined>;
  save(feature: Profile): Promise<void>;
  update(software: Profile): Promise<void>;
}
