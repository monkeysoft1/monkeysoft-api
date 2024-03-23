import UserTypeRepositoryMem from "../../../infra/repository/UserTypeRepositoryMem";
import CreateUserType from "./CreateUserType";
import GetAllUserTypes from "./GetAllUserType";

test("should be create a usertype", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const getAllUserTypes = new GetAllUserTypes(userTypeRepository);

  const createUserType = new CreateUserType(userTypeRepository);

  await createUserType.execute({
    description: "Administrador",
  });

  const userTypes = await getAllUserTypes.execute({});

  expect(userTypes).toHaveProperty(["list"]);
  expect(userTypes).toHaveProperty(["total"]);
  expect(userTypes).toHaveProperty(["total_page"]);
});
