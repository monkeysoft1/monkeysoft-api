import User from "../../core/entity/User";
import UserType from "../../core/entity/UserType";
import IUserRepository from "../../core/repository/IUserRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import QueryUtils from "./validators/QueryUtils";

export default class UserRepository extends BaseRepository implements IUserRepository {
  constructor(readonly connection: IConnection) {
    super();
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
