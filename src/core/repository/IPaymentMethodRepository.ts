import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import PaymentMethod from "../entity/PaymentMethod";

export default interface IPaymentMethodRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<PaymentMethod | undefined>;
  getByDescription(description: string): Promise<PaymentMethod | undefined>;
  save(paymentMethod: PaymentMethod): Promise<void>;
  update(paymentMethod: PaymentMethod): Promise<void>;
}
