export default class QueryUtils {
  static removeUndefined(obj: Object) {
    return Object.entries(obj).filter((f) => f[1] !== undefined);
  }

  static createInsert(
    schema: string,
    tableName: string,
    value: [string, any][]
  ) {
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

  static createUpdate(schema: string, tableName: string, setValues: [string, any][], whereCondition: string) {
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
}
