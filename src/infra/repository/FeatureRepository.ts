import Feature from "../../core/entity/Feature";
import FormattedDate from "../../core/entity/FormattedDate";
import IFeatureRepository from "../../core/repository/IFeatureRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import QueryUtils from "./validators/QueryUtils";

export default class FeatureRepository
  extends BaseRepository
  implements IFeatureRepository
{
  constructor(readonly connection: IConnection) {
    super();
  }

  async getById(id: string): Promise<Feature | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.feature where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [featureData] = rows;

    if (featureData) {
      const feature = new Feature();
      feature.id = featureData.id;
      feature.name = featureData.name;
      feature.url = featureData.url;
      feature.is_page = featureData.is_page;
      feature.description = featureData.description;
      feature.active = featureData.active;
      feature.created_on = featureData.created_on;
      feature.updated_on = featureData.updated_on;
      return featureData;
    }
  }

  async getByName(name: string): Promise<Feature | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.feature where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [featureData] = rows;

    if (featureData) {
      const feature = new Feature();
      feature.id = featureData.id;
      feature.name = featureData.name;
      feature.url = featureData.url;
      feature.is_page = featureData.is_page;
      feature.description = featureData.description;
      feature.active = featureData.active;
      feature.created_on = featureData.created_on;
      feature.updated_on = featureData.updated_on;
      return featureData;
    }
  }
  async save(feature: Feature): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: feature.id,
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      updated_on: feature.updated_on,
    });

    const { stmt, values } = QueryUtils.createInsert(
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
      name: feature.name,
      url: feature.url,
      is_page: feature.is_page,
      description: feature.description,
      active: feature.active,
      created_on: feature.created_on,
      updated_on: new FormattedDate().date,
    });

    var where = `id = '${feature.id}'`;

    const { stmt, values } = QueryUtils.createUpdate(
      this.ms,
      "feature",
      update,
      where
    );

    await this.connection.query(stmt, values);
  }
}
