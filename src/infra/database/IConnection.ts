export default interface IConnection {
  escape(value: string): string;
  query(statement: string, params: any[]): Promise<any>;
  close(): Promise<void>;
  open(): Promise<void>;
}
