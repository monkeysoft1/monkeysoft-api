import IConnection from "./IConnection";

export default class MySqlFakeConnection implements IConnection {
  escape(value: string): string {
    return "";
  }

  async query(statement: string, params: any[]): Promise<any> {}

  async close(): Promise<void> {}

  async open(): Promise<void> {}
}
