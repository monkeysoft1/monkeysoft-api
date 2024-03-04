import Software from "../entity/Software";

export default interface ISoftwareRepository {
  getByName(name: string): Promise<Software | undefined>;
  save(software: Software): Promise<void>;
}
