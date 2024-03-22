import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import UserType from "../entity/UserType";

export default interface IUserTypeRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<UserType | undefined>;
  getByDescription(description: string): Promise<UserType | undefined>;
  save(userType: UserType): Promise<void>;
  update(userType: UserType): Promise<void>;
}
