import Gateway from "../../core/entity/Gateway";
import IGatewayRepository from "../../core/repository/IGatewayRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class GatewayRepository extends BaseRepository implements IGatewayRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getByProductId(id_product: string): Promise<Gateway[]> {
    await this.connection.open();

    const stmt = `
      select
        g.id,
        g.description,
        g.payment_gateway_key,
        pg.id_gateway_product,
        pg.active,
        pg.created_on,
        pg.updated_on
      from ${this.ms}.product_gateway pg 
      join ${this.ms}.gateway g on pg.id_gateway = g.id
      where pg.id_product = ?`;
    const [rows] = await this.connection.query(stmt, [id_product]);

    let list = [];
    for (const gatewayData of rows) {
      const gateway = new Gateway();
      gateway.id = gatewayData.id;
      gateway.description = gatewayData.description;
      gateway.payment_gateway_key = gatewayData.payment_gateway_key;
      gateway.id_gateway_product = gatewayData.id_gateway_product;
      gateway.active = gatewayData.active;
      gateway.created_on = gatewayData.created_on;
      gateway.updated_on = gatewayData.updated_on;

      list.push(gateway);
    }

    return list;
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "gateway",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const gateway = new Gateway();
      gateway.id = row.id;
      gateway.description = row.description;
      gateway.payment_gateway_key = row.payment_gateway_key;
      gateway.created_on = row.created_on;
      list.push(gateway);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<Gateway | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.gateway where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [gatewayData] = rows;

    if (gatewayData) {
      const gateway = new Gateway();
      gateway.id = gatewayData.id;
      gateway.description = gatewayData.description;
      gateway.payment_gateway_key = gatewayData.payment_gateway_key;
      gateway.created_on = gatewayData.created_on;
      return gateway;
    }
  }

  async getByDescription(description: string): Promise<Gateway | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.gateway where description = ?`;

    const [rows] = await this.connection.query(stmt, [description]);
    const [gatewayData] = rows;

    if (gatewayData) {
      const gateway = new Gateway();
      gateway.id = gatewayData.id;
      gateway.description = gatewayData.description;
      gateway.payment_gateway_key = gatewayData.payment_gateway_key;
      gateway.created_on = gatewayData.created_on;
      return gateway;
    }
  }
  async save(gateway: Gateway): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: gateway.id,
      description: gateway.description,
      payment_gateway_key: gateway.payment_gateway_key,
      created_on: gateway.created_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "gateway",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(gateway: Gateway): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: gateway.id,
      description: gateway.description,
      payment_gateway_key: gateway.payment_gateway_key,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "gateway", update, where);

    await this.connection.query(stmt, [...values, gateway.id]);
  }
}
