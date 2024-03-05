import Software from "../../core/entity/Software";
import ISoftwareRepository from "../../core/repository/ISoftwareRepository";
import IConnection from "../database/IConnection";
import QueryUtils from "./validators/QueryUtils";

export default class SoftwareRepository implements ISoftwareRepository {
  constructor(readonly connection: IConnection) {}

  async getByName(name: string): Promise<Software | undefined> {
    await this.connection.open();

    const stmt = `select * from software where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [softwareData] = rows;

    if (softwareData) {
      const software = new Software();
      software.id = softwareData.id;
      software.name = softwareData.name;
      software.description = softwareData.description;
      software.active = softwareData.active;
      software.created_on = softwareData.created_on;
      return softwareData;
    }
  }
  async save(software: Software): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
      created_on: software.created_on
    });

    const { stmt, values } = QueryUtils.createInsert("software", insert);

    await this.connection.query(stmt, values);
  }
}
