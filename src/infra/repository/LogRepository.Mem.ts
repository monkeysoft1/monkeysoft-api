import Log from "../../core/entity/Log";
import ILogRepository from "../../core/repository/ILogRepository";
import BaseRepository from "./BaseRepository";

export default class LogRepository extends BaseRepository implements ILogRepository {
  logTable: Log[] = [];

  async getTableIdByName(tableName: string): Promise<number | undefined> {
    if (tableName === "software") {
      return Math.floor(Math.random() * 10000);
    } else {
      return undefined;
    }
  }

  async save(log: Log): Promise<void> {
    this.logTable.push(log);
  }
}
