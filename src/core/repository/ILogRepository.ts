import Log from "../entity/Log";

export default interface ILogRepository {
  getTableIdByName(tableName: string): Promise<number | undefined>;
  save(log: Log): Promise<void>;
}
