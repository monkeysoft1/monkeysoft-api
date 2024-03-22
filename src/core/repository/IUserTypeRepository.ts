import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import UserType from "../entity/UserType";

export default interface IUserTypeRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<UserType | undefined>;
  getByDescription(description: string): Promise<UserType | undefined>;
  save(paymentMethod: UserType): Promise<void>;
  update(paymentMethod: UserType): Promise<void>;
}
