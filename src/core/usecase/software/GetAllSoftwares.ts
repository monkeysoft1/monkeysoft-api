import { GetAllDTO } from "../../../infra/repository/IGetAll";
import Software from "../../entity/Software";
import ISoftwareRepository from "../../repository/ISoftwareRepository";

export default class GetAllSoftwares {
  constructor(readonly softwareRepository: ISoftwareRepository) {}

  async execute(input: GetAllDTO): Promise<Output> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.softwareRepository.getAll<Software>(input);

    const softwares = list.map((f: Software) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      active: f.active,
      created_on: f.created_on,
    }));

    return {
      list: softwares,
      total,
      total_page,
    };
  }
}

interface SoftwareDTO {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_on?: Date;
}

interface Output {
  list: SoftwareDTO[];
  total: number;
  total_page: number;
}
