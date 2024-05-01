import AppError from "../../entity/AppError";
import Utils from "../../entity/Utils";
import IUserRepository from "../../repository/IUserRepository";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class UpdateUser {
  constructor(
    readonly userRepository: IUserRepository,
    readonly userTypeRepository: IUserTypeRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!String(input.id).trim()) {
      throw new AppError("O id do usuário não pode ser vazio", 400);
    }

    const user = await this.userRepository.getById(input.id);

    if (!user) {
      throw new AppError("Id de usuario não localizado", 404);
    }

    Utils.hasChanges(input, user);

    if (!Utils.stringIsEmpty(input.email, true) && input.email !== user.email) {
      const hasUserByName = await this.userRepository.getByEmail(input.email);
      if (hasUserByName) {
        throw new AppError("Já existe outro user com o mesmo e-mail", 400);
      }

      user.email = input.email;
    }

    if (input.id_user_type) {
      const userType = await this.userTypeRepository.getById(input.id_user_type);
      if (!userType) {
        throw new AppError("Não existe um tipo de usuário com o id informado", 404);
      }

      user.userType = userType;
    }

    user.id = input.id;
    user.name = input.name;
    user.phone_number = input.phone_number;
    user.password = input.password;
    user.active = input.active;

    await this.userRepository.update(user);

    return {
      id: user.id,
      name: user.name,
      id_user_type: user.userType.id,
      email: user.email,
      phone_number: user.phone_number,
      active: user.active,
      created_on: user.created_on,
    };
  }
}

interface Input {
  id: string;
  name: string;
  id_user_type: string;
  email: string;
  phone_number: string;
  password: string;
  active: boolean;
}

interface Output {
  id: string;
  name: string;
  id_user_type: string;
  email: string;
  phone_number: string;
  active: boolean;
  created_on?: Date;
}
