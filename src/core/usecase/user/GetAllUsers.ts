import { GetAllDTO } from "../../../infra/repository/IGetAll";
import User from "../../entity/User";
import IUserRepository from "../../repository/IUserRepository";

export default class GetAllUsers {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(input: GetAllDTO): Promise<Output> {
    const filters = {
      name: input.name,
      active: input.active,
      id_user_type: input.id_user_type,
    };

    input.filters = filters;

    const { list, total, total_page } = await this.userRepository.getAll<User>(input);

    const users = list.map((f: User) => ({
      id: f.id,
      name: f.name,
      id_user_type: f.userType.id,
      email: f.email,
      phone_number: f.phone_number,
      active: f.active,
      created_on: f.created_on,
    }));

    return {
      list: users,
      total,
      total_page,
    };
  }
}

interface UserDTO {
  id: string;
  name: string;
  id_user_type: string;
  email: string;
  phone_number: string;
  active: boolean;
  created_on?: Date;
}

interface Output {
  list: UserDTO[];
  total: number;
  total_page: number;
}
