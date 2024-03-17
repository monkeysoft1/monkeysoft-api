import Feature from "../../core/entity/Feature";
import Software from "../../core/entity/Software";
import IFeatureRepository from "../../core/repository/IFeatureRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class FeatureRepository extends BaseRepository implements IFeatureRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getByProfileId(id: string): Promise<Feature[]> {
    await this.connection.open();

    const stmt = `
      select
        f.id,
        f.id_software,
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
      from ${this.ms}.feature as f
      join ${this.ms}.profile_feature pf on pf.id_feature = f.id
      where pf.id_profile = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [featureData] = rows;

    let list = [];
    if (featureData) {
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

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "feature",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const software = new Software();
      software.id = row.id_software;

      const feature = new Feature();
      feature.id = row.id;
      feature.software = software;
      feature.name = row.name;
      feature.description = row.description;
      feature.url = row.url;
      feature.active = row.active;
      feature.created_on = row.created_on;
      feature.updated_on = row.updated_on;
      list.push(feature);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<Feature | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.feature where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [featureData] = rows;

    if (featureData) {
      const software = new Software();
      software.id = featureData.id_software;

      const feature = new Feature();
      feature.id = featureData.id;
      feature.software = software;
      feature.name = featureData.name;
      feature.description = featureData.description;
      feature.url = featureData.url;
      feature.active = featureData.active;
      feature.created_on = featureData.created_on;
      feature.updated_on = featureData.updated_on;
      return feature;
    }
  }

  async getByName(name: string): Promise<Feature | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.feature where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [featureData] = rows;

    if (featureData) {
      const software = new Software();
      software.id = featureData.id_software;

      const feature = new Feature();
      feature.id = featureData.id;
      feature.software = software;
      feature.name = featureData.name;
      feature.url = featureData.url;
      feature.description = featureData.description;
      feature.active = featureData.active;
      feature.created_on = featureData.created_on;
      feature.updated_on = featureData.updated_on;
      return feature;
    }
  }
  async save(feature: Feature): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: feature.id,
      id_software: feature.software.id,
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      updated_on: feature.updated_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "feature",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(feature: Feature): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: feature.id,
      id_software: feature.software.id,
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      updated_on: feature.updated_on,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "feature", update, where);

    await this.connection.query(stmt, [...values, feature.id]);
  }
}
