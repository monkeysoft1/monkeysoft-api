import Profile from "../../core/entity/Profile";
import IProfileRepository from "../../core/repository/IProfileRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class ProfileRepository extends BaseRepository implements IProfileRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await QueryUtils.createSelectAll(
      this.connection,
      this.ms,
      "profile",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const profile = new Profile();
      profile.id = row.id;
      profile.id_software = row.id_software;
      profile.name = row.name;
      profile.active = row.active;
      profile.created_on = row.created_on;
      profile.updated_on = row.updated_on;
      list.push(profile);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<Profile | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.profile where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [profileData] = rows;

    if (profileData) {
      const profile = new Profile();
      profile.id = profileData.id;
      profile.id_software = profileData.id_software;
      profile.name = profileData.name;
      profile.active = profileData.active;
      profile.created_on = profileData.created_on;
      profile.updated_on = profileData.updated_on;
      return profile;
    }
  }

  async getByName(name: string): Promise<Profile | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.profile where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [profileData] = rows;

    if (profileData) {
      const profile = new Profile();
      profile.id = profileData.id;
      profile.id_software = profileData.id_software;
      profile.name = profileData.name;
      profile.active = profileData.active;
      profile.created_on = profileData.created_on;
      profile.updated_on = profileData.updated_on;
      return profile;
    }
  }
  async save(profile: Profile): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: profile.id,
      id_software: profile.id_software,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
      updated_on: profile.updated_on,
    });

    const { stmt, values } = QueryUtils.createInsert(this.ms, "profile", insert);

    await this.connection.query(stmt, values);
  }

  async update(profile: Profile): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: profile.id,
      id_software: profile.id_software,
      name: profile.name,
      active: profile.active,
      updated_on: profile.updated_on,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "profile", update, where);

    await this.connection.query(stmt, [...values, profile.id]);
  }
}
