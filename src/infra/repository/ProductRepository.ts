import Gateway from "../../core/entity/Gateway";
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

  async addGateway(id_product: string, gateway: Gateway): Promise<void> {
    await this.connection.open();

    const insert = QueryUtils.removeUndefined({
      id_Gateway: gateway.id,
      id_product: id_product,
      id_gateway_product: gateway.id_gateway_product,
      active: gateway.active,
      created_on: gateway.created_on,
    });

    const { stmt, values } = new QueryUtils(this.connection).createInsert(
      this.ms,
      "product_gateway",
      insert
    );

    await this.connection.query(stmt, values);
  }

  async updateGateway(id_product: string, gateway: Gateway): Promise<void> {
    await this.connection.open();

    const update = QueryUtils.removeUndefined({
      id_gateway_product: gateway.id_gateway_product,
      active: gateway.active,
      updated_on: gateway.updated_on,
    });

    const where = `id_product = ? and id_gateway = ?`;

    const { stmt, values } = QueryUtils.createUpdate(
      this.ms,
      "product_gateway",
      update,
      where
    );

    await this.connection.query(stmt, [...values, id_product, gateway.id]);
  }

  async removeGateway(id_product: string, id_gateway: string): Promise<void> {
    await this.connection.open();

    const remove = QueryUtils.removeUndefined({
      id_product: id_product,
      id_gateway: id_gateway,
    });

    const values = remove.map(([_, value]) => value);

    const where = `id_product = ? and id_Gateway = ?`;

    const { stmt } = QueryUtils.createDelete(this.ms, "product_gateway", where);

    await this.connection.query(stmt, values);
  }

  async getProductGateway(
    id_product: string,
    id_gateway: string
  ): Promise<Gateway | undefined> {
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
      from ${this.ms}.product_gateway as pg
      inner join ${this.ms}.gateway g on pg.id_gateway = g.id
      where pg.id_product = ? and pg.id_gateway = ?`;

    const [rows] = await this.connection.query(stmt, [id_product, id_gateway]);
    const [productGatewayData] = rows;

    if (productGatewayData) {
      const productGateway = new Gateway();
      productGateway.id = productGatewayData.id;
      productGateway.description = productGatewayData.description;
      productGateway.payment_gateway_key = productGatewayData.payment_gateway_key;
      productGateway.id_gateway_product = productGatewayData.id_gateway_product;
      productGateway.active = productGatewayData.active;
      productGateway.created_on = productGatewayData.created_on;
      productGateway.updated_on = productGatewayData.updated_on;
      return productGateway;
    }
  }
}
