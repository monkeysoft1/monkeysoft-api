import Log from "../../core/entity/Log";
import ILogRepository from "../../core/repository/ILogRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import QueryUtils from "./validators/QueryUtils";

export default class LogRepository extends BaseRepository implements ILogRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getTableIdByName(tableName: string): Promise<number | undefined> {
    await this.connection.open();

    const stmt = `SELECT table_id FROM information_schema.innodb_tables WHERE name='${this.ms}/${tableName}';`;
    const [rows] = await this.connection.query(stmt, [this.ms, tableName]);
    const [tableData] = rows;

    if (tableData) {
      return tableData.table_id;
    }

    return undefined;
  }

  async save(log: Log): Promise<void> {
    await this.connection.open();

    const staticData = {
      id_table: log.id_table,
      name_table: log.name_table,
      created_by: log.created_by,
      created_on: log.created_on,
    };

    for (const key in log.old_object as any) {
      if (log.new_object.hasOwnProperty(key)) {
        const input = {
          ...staticData,
          column_name: key,
          old_value: log.old_object[key as any],
          new_value: log.new_object[key as any],
        };

        if (input.old_value == input.new_value) continue;

        const maxLength = 500;

        if (input.old_value.length > maxLength) {
          console.log(`Valor antigo do atributo ${key} para a tabela ${input.name_table} 
            é superior ao tamanho máximo de caracteres na coluna de logs.`);
          continue;
        }

        if (input.new_value.length > maxLength) {
          console.log(`Valor novo do atributo ${key} para a tabela ${input.name_table} 
            é superior ao tamanho máximo de caracteres na coluna de logs.`);
          continue;
        }

        const insert = QueryUtils.removeUndefined(input);

        const { stmt, values } = new QueryUtils(this.connection).createInsert(
          this.ms,
          "log",
          insert
        );

        await this.connection.query(stmt, values);
      }
    }
  }
}
