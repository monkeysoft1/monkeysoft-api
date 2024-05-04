import AppError from "../../entity/AppError";
import IUserRepository from "../../repository/IUserRepository";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class GetUserById {
  constructor(
    readonly userRepository: IUserRepository,
    readonly userTypeRepository: IUserTypeRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!input.id) {
      throw new AppError("O id do usuario não foi informado", 404);
    }

    const user = await this.userRepository.getById(input.id);

    if (!user) {
      throw new AppError("Usuario não encontrado", 404);
    }

    const userType = await this.userTypeRepository.getById(user.userType.id);

    let userTypeDTO: UserTypeDTO | undefined = undefined;

    if (userType) {
      userTypeDTO = {
        id: userType.id,
        description: userType.description,
      };
    }

    return {
      id: user.id,
      name: user.name,
      user_type: userTypeDTO,
      email: user.email,
      phone_number: user.phone_number,
      active: user.active,
      created_on: user.created_on,
    };
  }
}

interface Input {
  id: string;
}

interface UserTypeDTO {
  id: string;
  description: string;
}

interface Output {
  id: string;
  name: string;
  user_type: UserTypeDTO | undefined;
  email: string;
  phone_number: string;
  active: boolean;
  created_on?: Date;
}
