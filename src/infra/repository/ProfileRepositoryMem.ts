import Profile from "../../core/entity/Profile";
import IProfileRepository from "../../core/repository/IProfileRepository";
import { GetAllDTO } from "./IGetAll";

export default class ProfileRepositoryMem implements IProfileRepository {
  feature: Profile[] = [];
  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.feature,
      total: this.feature.length,
      total_page: this.feature.length,
    };
  }

  async getById(id: string): Promise<Profile | undefined> {
    return this.feature.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Profile | undefined> {
    return this.feature.find((f) => f.name === name);
  }

  async save(feature: Profile): Promise<void> {
    this.feature.push(feature);
  }

  async update(feature: Profile): Promise<void> {
    this.feature = this.feature.map((i) => (i.id === feature.id ? feature : i));
  }
}
