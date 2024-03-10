import mysql from 'mysql2';
import { Pool } from 'mysql2/promise';
import AppError from '../../core/entity/AppError';
import IConnection from './IConnection';

export default class MySqlConnection implements IConnection {
  private pool?: Pool;

  async query(statement: string, params: any[]): Promise<any> {
    if (this.pool) {
      return await this.pool.execute(statement, params);
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }

  async open(): Promise<void> {
    try {
      if (this.pool) return;

      this.pool = mysql
        .createPool({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          port: process.env.DB_PORT,
        })
        .promise();

      await this.pool.getConnection();
    } catch (error) {
      throw new AppError('Data base cannot be access', 500);
    }
  }
}
