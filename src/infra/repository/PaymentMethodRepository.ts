import PaymentMethod from "../../core/entity/PaymentMethod";
import IPaymentMethodRepository from "../../core/repository/IPaymentMethodRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class PaymentMethodRepository extends BaseRepository implements IPaymentMethodRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "payment_method",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const paymentMethod = new PaymentMethod();
      paymentMethod.id = row.id;
      paymentMethod.description = row.description;
      list.push(paymentMethod);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<PaymentMethod | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.payment_method where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [paymentMethodData] = rows;

    if (paymentMethodData) {
      const paymentMethod = new PaymentMethod();
      paymentMethod.id = paymentMethodData.id;
      paymentMethod.description = paymentMethodData.description;
      return paymentMethod;
    }
  }

  async getByDescription(description: string): Promise<PaymentMethod | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.payment_method where description = ?`;

    const [rows] = await this.connection.query(stmt, [description]);
    const [paymentMethodData] = rows;

    if (paymentMethodData) {
      const paymentMethod = new PaymentMethod();
      paymentMethod.id = paymentMethodData.id;
      paymentMethod.description = paymentMethodData.description;
      return paymentMethod;
    }
  }
  async save(paymentMethod: PaymentMethod): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: paymentMethod.id,
      description: paymentMethod.description,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "payment_method",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(paymentMethod: PaymentMethod): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: paymentMethod.id,
      description: paymentMethod.description,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "payment_method", update, where);

    await this.connection.query(stmt, [...values, paymentMethod.id]);
  }
}
