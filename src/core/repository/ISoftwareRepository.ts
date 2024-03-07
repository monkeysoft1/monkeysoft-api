import Software from "../entity/Software";

export default interface ISoftwareRepository {
  getById(id: string): Promise<Software | undefined>;
  getByName(name: string): Promise<Software | undefined>;
  save(software: Software): Promise<void>;
  update(software: Software): Promise<void>;
}
