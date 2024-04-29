import User from "../../core/entity/User";
import UserType from "../../core/entity/UserType";
import IUserRepository from "../../core/repository/IUserRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class UserRepository extends BaseRepository implements IUserRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getById(id: string): Promise<User | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.user where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [userData] = rows;

    if (userData) {
      const user = new User();
      user.id = userData.id;
      user.name = userData.name;
      user.userType.id = userData.id_user_type;
      user.phone_number = userData.phone_number;
      user.email = userData.email;
      user.active = userData.active;
      user.created_on = userData.created_on;
      return user;
    }
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "user",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const user = new User();
      user.id = row.id;
      user.name = row.name;
      user.phone_number = row.phone_number;
      user.userType.id = row.id_user_type;
      user.active = row.active;
      user.created_on = row.created_on;
      list.push(user);
    }

    return { list, total, total_page };
  }

  async save(user: User): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: user.id,
      name: user.name,
      id_user_type: user.userType.id,
      password: user.password,
      phone_number: user.phone_number,
      email: user.email,
      active: user.active,
      created_on: user.created_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "user",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async getByToken(user: User): Promise<User | undefined> {
    await this.connection.open();

    const stmt = `
      select * from ${this.ms}.user 
      where token = ? and 
            active = 1 and 
            expire_token > current_timestamp()`;

    const [rows] = await this.connection.query(stmt, [user.token]);
    const [userData] = rows;

    if (userData) {
      const userType = new UserType();
      userType.id = userData.id_user_type;

      const user = new User();
      user.id = userData.id;
      user.userType = userType;
      user.name = userData.name;
      user.email = userData.email;
      user.phone_number = userData.phone_number;
      user.password = userData.password;
      user.active = userData.active;
      user.reset = userData.reset;
      user.token = userData.token;
      user.expire_token = userData.expire_token;
      user.login_tries = userData.login_tries;
      user.created_on = userData.created_on;
      user.updated_on = userData.updated_on;

      return user;
    }
  }
  async getByCredential(user: User): Promise<User | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.user where email = ? and password = ?`;

    const [rows] = await this.connection.query(stmt, [user.email, user.password]);
    const [userData] = rows;

    if (userData) {
      const userType = new UserType();
      userType.id = userData.id_user_type;

      const user = new User();
      user.id = userData.id;
      user.userType = userType;
      user.name = userData.name;
      user.email = userData.email;
      user.phone_number = userData.phone_number;
      user.password = userData.password;
      user.active = userData.active;
      user.reset = userData.reset;
      user.token = userData.token;
      user.expire_token = userData.expire_token;
      user.login_tries = userData.login_tries;
      user.created_on = userData.created_on;
      user.updated_on = userData.updated_on;

      return user;
    }
  }
  async getByEmail(email: string): Promise<User | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.user where email = ?`;

    const [rows] = await this.connection.query(stmt, [email]);
    const [userData] = rows;

    if (userData) {
      const userType = new UserType();
      userType.id = userData.id_user_type;

      const user = new User();
      user.id = userData.id;
      user.userType = userType;
      user.name = userData.name;
      user.email = userData.email;
      user.phone_number = userData.phone_number;
      user.password = userData.password;
      user.active = userData.active;
      user.reset = userData.reset;
      user.token = userData.token;
      user.expire_token = userData.expire_token;
      user.login_tries = userData.login_tries;
      user.created_on = userData.created_on;
      user.updated_on = userData.updated_on;

      return user;
    }
  }
  async update(user: User): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: user.id,
      id_user_type: user.userType.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      password: user.password,
      active: user.active,
      reset: user.reset,
      token: user.token,
      expire_token: user.expire_token,
      login_tries: user.login_tries,
      created_on: user.created_on,
      updated_on: user.updated_on,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "user", update, where);

    await this.connection.query(stmt, [...values, user.id]);
  }
}
