import Software from "../../core/entity/Software";
import ISoftwareRepository from "../../core/repository/ISoftwareRepository";

export default class SoftwareRepositoryMem implements ISoftwareRepository {
  software: Software[] = [];

  async getById(id: string): Promise<Software | undefined> {
    const software = this.software.find((f) => f.id === id);
    if (software) {
      return software;
    }
  }

  async getByName(name: string): Promise<Software | undefined> {
    const software = this.software.find((f) => f.name === name);
    if (software) {
      return software;
    }
  }

  async save(software: Software): Promise<void> {
    this.software.push(software);
  }

  async update(software: Software): Promise<void> {
    this.software = this.software.map((i) => {
      if (i.id === software.id) {
        return software;
      }
      return i;
    });
  }
}
