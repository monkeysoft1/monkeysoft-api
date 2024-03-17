import PaymentMethod from "../../core/entity/PaymentMethod";
import IPaymentMethodRepository from "../../core/repository/IPaymentMethodRepository";
import { GetAllDTO } from "./IGetAll";

export default class PaymentMethodRepositoryMem implements IPaymentMethodRepository {
  paymentMethod: PaymentMethod[] = [];

  async getAll(input: GetAllDTO): Promise<any> {
    return {
      list: this.paymentMethod,
      total: this.paymentMethod.length,
      total_page: this.paymentMethod.length,
    };
  }

  async getById(id: string): Promise<PaymentMethod | undefined> {
    return this.paymentMethod.find((f) => f.id === id);
  }

  async getByDescription(description: string): Promise<PaymentMethod | undefined> {
    return this.paymentMethod.find((f) => f.description === description);
  }

  async save(paymentMethod: PaymentMethod): Promise<void> {
    this.paymentMethod.push(paymentMethod);
  }

  async update(paymentMethod: PaymentMethod): Promise<void> {
    this.paymentMethod = this.paymentMethod.map((i) => (i.id === paymentMethod.id ? paymentMethod : i));
  }
}
