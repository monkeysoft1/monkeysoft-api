import Software from "../../core/entity/Software";
import ISoftwareRepository from "../../core/repository/ISoftwareRepository";

export default class SoftwareRepositoryMem implements ISoftwareRepository {
  software: Software[] = [];

  async getById(id: string): Promise<Software | undefined> {
    return this.software.find((f) => f.id === id);
  }

  async getByName(name: string): Promise<Software | undefined> {
    return this.software.find((f) => f.name === name);
  }

  async save(software: Software): Promise<void> {
    this.software.push(software);
  }

  async update(software: Software): Promise<void> {
    this.software = this.software.map((i) => (i.id === software.id ? software : i));
  }
}
