import Feature from "../../core/entity/Feature";
import Profile from "../../core/entity/Profile";
import IProfileRepository from "../../core/repository/IProfileRepository";
import { GetAllDTO } from "./IGetAll";

export default class ProfileRepositoryMem implements IProfileRepository {
  profile: Profile[] = [];

  async addFeature(id_profile: string, feature: Feature): Promise<void> {}

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.profile,
      total: this.profile.length,
      total_page: this.profile.length,
    };
  }

  async getById(id: string): Promise<Profile | undefined> {
    return this.profile.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Profile | undefined> {
    return this.profile.find((f) => f.name === name);
  }

  async save(profile: Profile): Promise<void> {
    this.profile.push(profile);
  }

  async update(profile: Profile): Promise<void> {
    this.profile = this.profile.map((i) => (i.id === profile.id ? profile : i));
  }
}
