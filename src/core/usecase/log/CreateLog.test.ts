import LogRepositoryMem from "../../../infra/repository/LogRepository.Mem";
import CreateLog from "./CreateLog";

test("should be return false when old_object is null", async () => {
  const logRepository = new LogRepositoryMem();
  const createLog = new CreateLog(logRepository);

  let new_object = {
    name: "MokeyZap",
    active: true,
  };

  let log = await createLog.execute({
    name_table: "software",
    new_object: new_object,
    old_object: null,
  });

  expect(log).toBe(false);
});

test("should be return false when new_object is null", async () => {
  const logRepository = new LogRepositoryMem();
  const createLog = new CreateLog(logRepository);

  let old_object = {
    name: "MokeyZap",
    active: true,
  };

  let log = await createLog.execute({
    name_table: "software",
    new_object: null,
    old_object: old_object,
  });

  expect(log).toBe(false);
});

test("should be return false when name_table is null", async () => {
  const logRepository = new LogRepositoryMem();
  const createLog = new CreateLog(logRepository);

  let old_object = {
    name: "MokeyZap",
    active: true,
  };

  let new_object = {
    name: "MonkeyTree",
    active: false,
  };

  let log = await createLog.execute({
    name_table: "",
    new_object: new_object,
    old_object: old_object,
  });

  expect(log).toBe(false);
});

test("should be return false when table not exist", async () => {
  const logRepository = new LogRepositoryMem();
  const createLog = new CreateLog(logRepository);

  let old_object = {
    name: "MokeyZap",
    active: true,
  };

  let new_object = {
    name: "MonkeyTree",
    active: false,
  };

  let log = await createLog.execute({
    name_table: "softwasdre",
    new_object: new_object,
    old_object: old_object,
  });

  expect(log).toBe(false);
});

test("should be return false when table not exist", async () => {
  const logRepository = new LogRepositoryMem();
  const createLog = new CreateLog(logRepository);

  let old_object = {
    name: "MokeyZap",
    active: true,
  };

  let new_object = {
    name: "MonkeyTree",
    active: false,
  };

  let log = await createLog.execute({
    name_table: generateLongString(256),
    new_object: new_object,
    old_object: old_object,
  });

  expect(log).toBe(false);
});

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
