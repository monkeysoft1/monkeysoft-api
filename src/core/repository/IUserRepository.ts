import User from "../entity/User";

export default interface IUserRepository {
  getByCredential(user: User): Promise<User | undefined>;
  getByEmail(email: string): Promise<User | undefined>;
  getByToken(user: User): Promise<User | undefined>;
  update(user: User): Promise<void>;
}
