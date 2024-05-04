import AppError from "../../entity/AppError";
import Software from "../../entity/Software";
import Utils from "../../entity/Utils";
import ILogRepository from "../../repository/ILogRepository";
import ISoftwareRepository from "../../repository/ISoftwareRepository";
import CreateLog from "../log/CreateLog";

export default class UpdateSoftware {
  constructor(
    readonly softwareRepository: ISoftwareRepository,
    readonly logRepository: ILogRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!String(input.id).trim()) {
      throw new AppError("O id do software não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name)) {
      throw new AppError("O nome do software não pode ser vazio", 400);
    }

    const software = await this.softwareRepository.getById(input.id);

    if (!software) {
      throw new AppError("Software não encontrado", 404);
    }

    Utils.hasChanges(input, software);

    const oldSoftware = {
      name: software.name,
      active: software.active,
    } as SoftwareLog;

    if (input.name && input.name !== software.name) {
      const hasSoftwareByName = await this.softwareRepository.getByName(input.name);

      if (hasSoftwareByName) {
        throw new AppError("Já existe outro software com o mesmo nome.", 400);
      }

      software.name = input.name;
    }

    software.description = input.description;
    software.active = input.active;

    await this.softwareRepository.update(software);

    await this.createLog(software, oldSoftware);

    return {
      id: software.id,
      name: software.name,
      description: software.description,
      active: software.active,
      created_on: software.created_on,
    };
  }

  private async createLog(software: Software, oldSoftware: SoftwareLog) {
    let createLog = new CreateLog(this.logRepository);

    let newSoftware = {
      name: software.name,
      active: software.active,
    } as SoftwareLog;

    createLog.execute({
      name_table: "software",
      old_object: oldSoftware,
      new_object: newSoftware,
    });
  }
}

interface Input {
  id: string;
  name?: string;
  description?: string;
  active?: boolean;
}

interface Output {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  created_on?: Date;
}

interface SoftwareLog {
  name: string;
  active: boolean;
}
