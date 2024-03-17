import Software from "../../core/entity/Software";
import ISoftwareRepository from "../../core/repository/ISoftwareRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class SoftwareRepository extends BaseRepository implements ISoftwareRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "software",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const software = new Software();
      software.id = row.id;
      software.name = row.name;
      software.description = row.description;
      software.active = row.active;
      software.created_on = row.created_on;
      list.push(software);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<Software | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.software where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [softwareData] = rows;

    if (softwareData) {
      const software = new Software();
      software.id = softwareData.id;
      software.name = softwareData.name;
      software.description = softwareData.description;
      software.active = softwareData.active;
      software.created_on = softwareData.created_on;
      return software;
    }
  }

  async getByName(name: string): Promise<Software | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.software where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [softwareData] = rows;

    if (softwareData) {
      const software = new Software();
      software.id = softwareData.id;
      software.name = softwareData.name;
      software.description = softwareData.description;
      software.active = softwareData.active;
      software.created_on = softwareData.created_on;
      return software;
    }
  }
  async save(software: Software): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
      created_on: software.created_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "software",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(software: Software): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "software", update, where);

    await this.connection.query(stmt, [...values, software.id]);
  }
}
