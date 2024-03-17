import Feature from "../../core/entity/Feature";
import Profile from "../../core/entity/Profile";
import Software from "../../core/entity/Software";
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

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "profile",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const software = new Software();
      software.id = row.id_software;

      const profile = new Profile();
      profile.id = row.id;
      profile.software = software;
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
      const software = new Software();
      software.id = profileData.id_software;

      const profile = new Profile();
      profile.id = profileData.id;
      profile.software = software;
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
      const software = new Software();
      software.id = profileData.id_software;

      const profile = new Profile();
      profile.id = profileData.id;
      profile.software = software;
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
      id_software: profile.software.id,
      name: profile.name,
      active: profile.active,
      created_on: profile.created_on,
      updated_on: profile.updated_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "profile",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(profile: Profile): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: profile.id,
      id_software: profile.software.id,
      name: profile.name,
      active: profile.active,
      updated_on: profile.updated_on,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "profile", update, where);

    await this.connection.query(stmt, [...values, profile.id]);
  }

  async addFeature(id_profile: string, feature: Feature): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id_feature: feature.id,
      id_profile: id_profile,
      read: feature.read,
      create: feature.create,
      update: feature.update,
      delete: feature.delete,
      active: feature.active,
      created_on: feature.created_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "profile_feature",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async updateFeature(id_profile: string, feature: Feature): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id_feature: feature.id,
      id_profile: id_profile,
      read: feature.read,
      create: feature.create,
      update: feature.update,
      delete: feature.delete,
      active: feature.active,
      updated_on: feature.updated_on
    });

    const where = `id_feature = ? and id_profile = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "profile_feature", update, where);

    await this.connection.query(stmt, [...values, feature.id, id_profile]);
  }
  
  async removeFeature(id_profile: string, id_feature: string): Promise<void> {
    await this.connection.open();

    const remove = QueryUtils.removeUndefined({
      id_feature: id_feature,
      id_profile: id_profile,
    });

    const where = `id_feature = ? and id_profile = ?`;

    const { stmt } = QueryUtils.createDelete(this.ms, "profile_feature", where);

    await this.connection.query(stmt, remove);
  }

  async getFeatureByProfileIdAndFeatureId(
    id_profile: string,
    id_feature: string
  ): Promise<Feature | undefined> {
    await this.connection.open();

    const stmt = `
        select
        f.id,
        f.name,
        f.url,
        f.description,
        pf.read,
        pf.create,
        pf.update,
        pf.delete,
        pf.active,
        pf.created_on,
        pf.updated_on
      from ${this.ms}.profile_feature as pf
      inner join ${this.ms}.feature f on pf.id_feature = f.id
      where pf.id_profile = ? and pf.id_feature = ?`;
    const [rows] = await this.connection.query(stmt, [id_profile, id_feature]);
    const [profileFeatureData] = rows;

    if (profileFeatureData) {
      const profileFeature = new Feature();
      profileFeature.id = profileFeatureData.id_feature;
      profileFeature.read = profileFeatureData.read;
      profileFeature.name = profileFeatureData.name;
      profileFeature.description = profileFeatureData.description;
      profileFeature.url = profileFeatureData.url;
      profileFeature.active = profileFeatureData.active;
      profileFeature.created_on = profileFeatureData.created_on;
      profileFeature.updated_on = profileFeatureData.updated_on;
      return profileFeature;
    }
  }

  async getFeaturesByProfileId(id: string): Promise<Feature[]> {
    await this.connection.open();

    const stmt = `
      select
        f.id,
        f.name,
        f.url,
        f.description,
        pf.read,
        pf.create,
        pf.update,
        pf.delete,
        pf.active,
        pf.created_on,
        pf.updated_on
      from ${this.ms}.profile_feature pf 
      join ${this.ms}.feature f on pf.id_feature = f.id
      where pf.id_profile = ?`;
    const [rows] = await this.connection.query(stmt, [id]);

    let list = [];
    for (const featureData of rows) {
      const feature = new Feature();
      feature.id = featureData.id;
      feature.name = featureData.name;
      feature.url = featureData.url;
      feature.description = featureData.description;
      feature.read = featureData.read;
      feature.create = featureData.create;
      feature.update = featureData.update;
      feature.delete = featureData.delete;
      feature.active = featureData.active;
      feature.created_on = featureData.created_on;
      feature.updated_on = featureData.updated_on;

      list.push(feature);
    }

    return list;
  }
}
