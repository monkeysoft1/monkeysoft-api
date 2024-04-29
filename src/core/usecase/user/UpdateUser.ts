import AppError from "../../entity/AppError";
import UserType from "../../entity/UserType";
import Utils from "../../entity/Utils";
import IUserRepository from "../../repository/IUserRepository";

export default class UpdateUser {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(input: Input): Promise<Output> {
    if (!String(input.id).trim()) {
      throw new AppError("O id do usuário não pode ser vazio", 400);
    }

    if (Utils.stringIsEmpty(input.name, true)) {
      throw new AppError("O nome do usuário não pode ser vazio", 400);
    }

    const user = await this.userRepository.getById(input.id);

    if (!user) {
      throw new AppError("Id de usuario não localizado", 404);
    }

    Utils.hasChanges(input, user);

    if (input.email !== user.email) {
      const hasUserByName = await this.userRepository.getByEmail(input.email);

      if (hasUserByName) {
        throw new AppError("Já existe outro user com o mesmo e-mail.", 400);
      }

      user.name = input.name;
    }

    user.id = input.id;
    user.name = input.name;
    user.userType.id = input.id_user_type;
    user.email = input.email;
    user.phone_number = input.phone_number;
    user.password = input.password;
    user.active = input.active;

    await this.userRepository.update(user);

    return {
      id: user.id,
      name: user.name,
      userType: user.userType,
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
  userType: UserType;
  email: string;
  phone_number: string;
  active: boolean;
  created_on?: Date;
}
