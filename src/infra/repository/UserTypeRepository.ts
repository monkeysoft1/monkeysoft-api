import UserType from "../../core/entity/UserType";
import IUserTypeRepository from "../../core/repository/IUserTypeRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class UserTypeRepository extends BaseRepository implements IUserTypeRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "user_type",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const userType = new UserType();
      userType.id = row.id;
      userType.description = row.description;
      list.push(userType);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<UserType | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.user_type where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [userTypeData] = rows;

    if (userTypeData) {
      const userType = new UserType();
      userType.id = userTypeData.id;
      userType.description = userTypeData.description;
      return userType;
    }
  }

  async getByDescription(description: string): Promise<UserType | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.user_type where description = ?`;

    const [rows] = await this.connection.query(stmt, [description]);
    const [userTypeData] = rows;

    if (userTypeData) {
      const userType = new UserType();
      userType.id = userTypeData.id;
      userType.description = userTypeData.description;
      return userType;
    }
  }
  async save(userType: UserType): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: userType.id,
      description: userType.description,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "user_type",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(userType: UserType): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: userType.id,
      description: userType.description,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "user_type", update, where);

    await this.connection.query(stmt, [...values, userType.id]);
  }
}
