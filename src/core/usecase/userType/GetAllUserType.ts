import { GetAllDTO } from "../../../infra/repository/IGetAll";
import UserType from "../../entity/UserType";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class GetAllUserTypes {
  constructor(readonly userTypeRepository: IUserTypeRepository) {}

  async execute(input: GetAllDTO): Promise<Output> {
    const filters = {
      name: input.name,
      active: input.active,
    };

    input.filters = filters;

    const { list, total, total_page } =
      await this.userTypeRepository.getAll<UserType>(input);

    const userTypes = list.map((f: UserType) => ({
      id: f.id,
      description: f.description,
    }));

    return {
      list: userTypes,
      total,
      total_page,
    };
  }
}

interface UserTypeDTO {
  id: string;
  description: string;
}

interface Output {
  list: UserTypeDTO[];
  total: number;
  total_page: number;
}
