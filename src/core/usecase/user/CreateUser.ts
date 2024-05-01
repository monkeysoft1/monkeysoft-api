import AppError from "../../entity/AppError";
import User from "../../entity/User";
import UserType from "../../entity/UserType";
import Utils from "../../entity/Utils";
import IUserRepository from "../../repository/IUserRepository";
import IUserTypeRepository from "../../repository/IUserTypeRepository";

export default class CreateUser {
  constructor(
    readonly userRepository: IUserRepository,
    readonly userTypeRepository: IUserTypeRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.name, true)) {
      throw new AppError("O nome do usuário não foi informado.", 400);
    }

    if (Utils.stringIsEmpty(input.password, true)) {
      throw new AppError("A senha do usuário não foi informada", 400);
    }

    const userType = await this.userTypeRepository.getById(input.id_user_type);

    if (!userType) throw new AppError("Tipo de usuário informado não existe", 400);

    const user = new User();
    user.create();
    user.name = input.name;
    user.userType = userType;
    user.email = input.email;
    user.password = input.password;
    user.phone_number = input.phone_number;
    user.active = input.active;

    const hasUser = await this.userRepository.getByEmail(input.email);
    console.log(hasUser);

    if (hasUser) {
      throw new AppError("O e-mail informado já foi cadastrado", 400);
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      userType: user.userType,
      email: user.email,
      phone_number: user.phone_number,
      active: user.active,
    };
  }
}

interface Input {
  name: string;
  id_user_type: string;
  email: string;
  phone_number: string;
  password: string;
  active: boolean;
}

interface Output {
  id: string;
  userType: UserType;
  name: string;
  email: string;
  phone_number: string;
  active: boolean;
}
