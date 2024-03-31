import Session from "../../core/entity/Session";
import ISessionRepository from "../../core/repository/ISessionRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import QueryUtils from "./validators/QueryUtils";

export default class SessionRepository extends BaseRepository implements ISessionRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async save(id_user: string, session: Session): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: id_user,
      token: session.token,
      expire_token: session.expire_token,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "user", update, where);

    await this.connection.query(stmt, [...values, id_user]);
  }
}
