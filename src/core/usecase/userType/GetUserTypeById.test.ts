import UserTypeRepositoryMem from "../../../infra/repository/UserTypeRepositoryMem";
import CreateUserType from "./CreateUserType";
import GetUserTypeById from "./GetUserTypeById";

test("should be search a User Type by id", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const getUserTypeById = new GetUserTypeById(userTypeRepository);

  const createUserType = new CreateUserType(userTypeRepository);

  const userType = await createUserType.execute({
    description: "Administrador",
  });

  const userTypes = await getUserTypeById.execute(userType);

  expect(userTypes).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const getUserTypeById = new GetUserTypeById(userTypeRepository);

  await expect(getUserTypeById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const getUserTypeById = new GetUserTypeById(userTypeRepository);

  const createUserType = new CreateUserType(userTypeRepository);

  const userType = await createUserType.execute({
    description: "Administrador",
  });

  userType.id = "79db678a-eb17-430c-b03a";

  await expect(getUserTypeById.execute(userType)).rejects.toThrow();
});
