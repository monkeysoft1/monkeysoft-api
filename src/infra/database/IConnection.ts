export default interface IConnection {
  query(statement: string, params: any[]): Promise<any>;
  close(): Promise<void>;
  open(): Promise<void>;
}
