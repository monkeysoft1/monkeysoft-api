import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Gateway from "../entity/Gateway";

export default interface IGatewayRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Gateway | undefined>;
  getByDescription(name: string): Promise<Gateway | undefined>;
  save(gateway: Gateway): Promise<void>;
  update(gateway: Gateway): Promise<void>;
}
