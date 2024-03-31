import AppError from "../../entity/AppError";
import User from "../../entity/User";
import Utils from "../../entity/Utils";
import IUserRepository from "../../repository/IUserRepository";

export default class GetSession {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(input: Input): Promise<void> {
    if (Utils.stringIsEmpty(input.token, true)) {
      throw new AppError("Token não informado", 400);
    }

    let user = new User();
    user.token = input.token;

    const authenticatedUser = await this.userRepository.getByToken(user);

    if (!authenticatedUser) {
      throw new AppError("Acesso negado", 401);
    }
  }
}

interface Input {
  token: string;
}
