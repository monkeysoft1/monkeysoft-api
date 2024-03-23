import Product from "../../core/entity/Product";
import Software from "../../core/entity/Software";
import IProductRepository from "../../core/repository/IProductRepository";
import IConnection from "../database/IConnection";
import BaseRepository from "./BaseRepository";
import { GetAllDTO } from "./IGetAll";
import QueryUtils from "./validators/QueryUtils";

export default class ProductRepository extends BaseRepository implements IProductRepository {
  constructor(readonly connection: IConnection) {
    super();
  }

  async getAll(input: GetAllDTO): Promise<any> {
    await this.connection.open();

    const { rows, total, total_page } = await new QueryUtils(this.connection).createSelectAll(
      this.ms,
      "product",
      input,
      input.filters
    );

    let list = [];
    for (const row of rows) {
      const software = new Software();
      software.id = row.id_software;

      const product = new Product();
      product.id = row.id;
      product.software = software;
      product.name = row.name;
      product.description = row.description;
      product.price = row.price;
      product.active = row.active;
      product.created_on = row.created_on;
      product.updated_on = row.updated_on;
      list.push(product);
    }

    return { list, total, total_page };
  }

  async getById(id: string): Promise<Product | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.product where id = ?`;

    const [rows] = await this.connection.query(stmt, [id]);
    const [productData] = rows;

    if (productData) {
      const software = new Software();
      software.id = productData.id_software;

      const product = new Product();
      product.id = productData.id;
      product.software = software;
      product.name = productData.name;
      product.description = productData.description;
      product.price = productData.price;
      product.active = productData.active;
      product.created_on = productData.created_on;
      product.updated_on = productData.updated_on;
      return product;
    }
  }

  async getByName(name: string): Promise<Product | undefined> {
    await this.connection.open();

    const stmt = `select * from ${this.ms}.product where name = ?`;

    const [rows] = await this.connection.query(stmt, [name]);
    const [productData] = rows;

    if (productData) {
      const software = new Software();
      software.id = productData.id_software;

      const product = new Product();
      product.id = productData.id;
      product.software = software;
      product.name = productData.name;
      product.price = productData.price;
      product.description = productData.description;
      product.active = productData.active;
      product.created_on = productData.created_on;
      product.updated_on = productData.updated_on;
      return product;
    }
  }

  async save(product: Product): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id: product.id,
      id_software: product.software.id,
      name: product.name,
      price: product.price,
      description: product.description,
      active: product.active,
      created_on: product.created_on,
      updated_on: product.updated_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "product",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async update(product: Product): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id: product.id,
      id_software: product.software.id,
      name: product.name,
      price: product.price,
      description: product.description,
      active: product.active,
      updated_on: product.updated_on,
    });

    const where = `id = ?`;

    const { stmt, values } = QueryUtils.createUpdate(this.ms, "product", update, where);

    await this.connection.query(stmt, [...values, product.id]);
  }
}
