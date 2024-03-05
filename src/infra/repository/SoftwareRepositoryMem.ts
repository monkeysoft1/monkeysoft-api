import Software from "../../core/entity/Software";
import ISoftwareRepository from "../../core/repository/ISoftwareRepository";

export default class SoftwareRepositoryMem implements ISoftwareRepository {
  software: Software[] = [];

  async getByName(name: string): Promise<Software | undefined> {
    const software = this.software.find((f) => f.name === name);
    if (software) {
      return software;
    }
  }
  
  async save(software: Software): Promise<void> {
    this.software.push(software);
  }
}
