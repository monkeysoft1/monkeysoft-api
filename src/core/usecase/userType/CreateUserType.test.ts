import UserTypeRepositoryMem from "../../../infra/repository/UserTypeRepositoryMem";
import CreateUserType from "./CreateUserType";

test("should be create a User Type", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const userType = await createUserType.execute({
    description: "Administrador",
  });

  expect(userType.description).toBe("Administrador");
});

test("should be throw an error when description is empty", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);

  await expect(
    createUserType.execute({
      description: "",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const userTypeData = {
    description: "Administrador",
    active: true,
  };
  await createUserType.execute(userTypeData);

  await expect(createUserType.execute(userTypeData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const userTypeData = {
    description: generateLongString(256),
  };

  await expect(createUserType.execute(userTypeData)).rejects.toThrow();
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
