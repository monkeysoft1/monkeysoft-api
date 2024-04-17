import Log from "../../entity/Log";
import Utils from "../../entity/Utils";
import ILogRepository from "../../repository/ILogRepository";

export default class CreateLog {
  constructor(readonly logRepository: ILogRepository) {}

  async execute(input: Input): Promise<boolean> {
    if (Utils.stringIsEmpty(input.name_table, true)) {
      console.log("O nome da tabela está vazio ou não foi informado.");
      return false;
    }

    if (!input.new_object) {
      console.log("O novo objeto para log não foi informado.");
      return false;
    }

    if (!input.old_object) {
      console.log("O objeto antigo para log não foi informado.");
      return false;
    }

    console.log("O nome da tabela é:" + input.name_table);

    let id_table = await this.logRepository.getTableIdByName(input.name_table);

    if (!id_table) {
      console.log("A tabela informada não existe.");
      return false;
    }

    //ToDo: Pegar nome do usuário autenticado

    const log = new Log();
    log.id_table = id_table;
    log.name_table = input.name_table;
    log.old_object = input.old_object;
    log.new_object = input.new_object;

    await this.logRepository.save(log);

    return true;
  }
}

interface Input {
  name_table: string;
  old_object: any;
  new_object: any;
}
