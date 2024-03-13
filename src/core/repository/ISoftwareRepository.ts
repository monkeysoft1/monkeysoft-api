import { GetAllDTO, GetAllOutputDTO } from "../../infra/repository/IGetAll";
import Software from "../entity/Software";

export default interface ISoftwareRepository {
  getAll<T>(input: GetAllDTO): Promise<GetAllOutputDTO<T>>;
  getById(id: string): Promise<Software | undefined>;
  getByName(name: string): Promise<Software | undefined>;
  save(software: Software): Promise<void>;
  update(software: Software): Promise<void>;
}
