import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import User from "../entity/User";

export default interface IUserRepository {
  getById(id: string): Promise<User | undefined>;
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getByCredential(user: User): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  getByToken(user: User): Promise<User | undefined>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
