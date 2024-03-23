import UserType from "../../core/entity/UserType";
import IUserTypeRepository from "../../core/repository/IUserTypeRepository";
import { GetAllDTO } from "./IGetAll";

export default class UserTypeRepositoryMem implements IUserTypeRepository {
  userType: UserType[] = [];

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.userType,
      total: this.userType.length,
      total_page: this.userType.length,
    };
  }

  async getById(id: string): Promise<UserType | undefined> {
    return this.userType.find((f) => f.id === id);
  }

  async getByDescription(description: string): Promise<UserType | undefined> {
    return this.userType.find((f) => f.description === description);
  }

  async save(userType: UserType): Promise<void> {
    this.userType.push(userType);
  }

  async update(userType: UserType): Promise<void> {
    this.userType = this.userType.map((i) => (i.id === userType.id ? userType : i));
  }
}
