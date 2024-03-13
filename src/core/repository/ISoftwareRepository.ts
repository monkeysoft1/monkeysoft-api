import GetAllDTO from "../../infra/repository/IGetAll";
import Software from "../entity/Software";

export default interface ISoftwareRepository {
  getAll(input: GetAllDTO): Promise<any>;
  getById(id: string): Promise<Software | undefined>;
  getByName(name: string): Promise<Software | undefined>;
  save(software: Software): Promise<void>;
  update(software: Software): Promise<void>;
}
