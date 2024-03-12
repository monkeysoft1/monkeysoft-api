import IConnection from "../../database/IConnection";
export default class QueryUtils {
  static removeUndefined(obj: Object) {
    return Object.entries(obj).filter((f) => f[1] !== undefined);
  }

  static createInsert(schema: string, tableName: string, value: [string, any][]) {
    const columns = value.map((f) => f[0]).join(",");
    const params = value.map(() => "?").join();
    const values = value.map((f) => f[1]);

    const stmt = `
    insert into ${schema}.${tableName}(${columns}) values (${params})`;
    return {
      stmt,
      values,
    };
  }

  static createUpdate(
    schema: string,
    tableName: string,
    setValues: [string, any][],
    whereCondition: string
  ) {
    const setClause = setValues.map(([field, _]) => `${field} = ?`).join(",");
    const values = setValues.map(([_, value]) => value);

    const stmt = `
      update ${schema}.${tableName}
      set ${setClause}
      where ${whereCondition}`;

    return {
      stmt,
      values,
    };
  }

  static createDelete(schema: string, tableName: string, whereCondition: string) {
    const stmt = `
      delete from ${schema}.${tableName}
      where ${whereCondition}`;

    return {
      stmt,
    };
  }

  static async createSelectAll(
    connection: IConnection,
    schema: string,
    tableName: string,
    input: any,
    filters?: any
  ) {
    const { order, column, page = 1, limit = 20, all = false } = input;

    const validConditions = this.removeUndefined(filters);
    const values = validConditions.map((c) => `${c[1]}%`);

    let where = "";
    if (validConditions.length) {
      where += "where ";
      where += validConditions.map((c) => `${c[0]} like ?`).join(" and");
    }

    let orderClause = "";
    if (column) {
      orderClause += `order by ${connection.escape(column)} `;
      orderClause += order === "asc" ? "asc" : "desc";
      values.push(column);
    }

    let stmt = `
      select * from ${schema}.${tableName}
      ${where}
      ${orderClause}
    `;

    const stmtCount = `
      select count(*) as count from ${schema}.${tableName}
      ${where}
      ${orderClause}
    `;

    if (!all) {
      stmt += `limit ${limit} offset ${(page - 1) * limit}`;
    }

    const [rows] = await connection.query(stmt, values);

    const [rowsCount] = await connection.query(stmtCount, values);

    const count = rowsCount[0].count;
    const total = count;
    const total_page = Math.ceil(Number(count) / 20);

    return {
      rows,
      total,
      total_page,
    };
  }
}
