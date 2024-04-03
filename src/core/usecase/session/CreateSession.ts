import AppError from "../../entity/AppError";
import Session from "../../entity/Session";
import User from "../../entity/User";
import Utils from "../../entity/Utils";
import ISessionRepository from "../../repository/ISessionRepository";
import IUserRepository from "../../repository/IUserRepository";

export default class CreateSession {
  constructor(
    readonly sessionRepository: ISessionRepository,
    readonly userRepository: IUserRepository
  ) {}

  async execute(input: Input): Promise<Output> {
    if (Utils.stringIsEmpty(input.email, true)) {
      throw new AppError("E-mail não informado", 400);
    }

    if (Utils.stringIsEmpty(input.password, true)) {
      throw new AppError("Senha não informada", 400);
    }

    let userCredential = new User();
    userCredential.email = input.email;
    userCredential.password = input.password;

    const user = await this.userRepository.getByEmail(userCredential.email);

    if (!user) {
      throw new AppError("O usuário informado não existe no sistema", 404);
    }

    if (!user.active) {
      throw new AppError("O usuário informado não está ativo", 400);
    }

    const userWithCredential = await this.userRepository.getByCredential(userCredential);

    if (!userWithCredential) {
      user.incrementLoginTries();
      await this.userRepository.update(user);
      throw new AppError("Credencial inválida", 400);
    }

    const session = new Session(60);

    await this.sessionRepository.save(user.id, session);

    return {
      timeout: session.timeout,
      token: session.token,
    };
  }
}

interface Input {
  email: string;
  password: string;
}

interface Output {
  token: string;
  timeout: number;
}
