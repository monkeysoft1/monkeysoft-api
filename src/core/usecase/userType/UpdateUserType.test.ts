import UserTypeRepositoryMem from "../../../infra/repository/UserTypeRepositoryMem";
import CreateUserType from "./CreateUserType";
import UpdateUserType from "./UpdateUserType";

test("should be update User Type", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const newUserType = await createUserType.execute({
    description: "Administrador",
  });

  const updateUserType = new UpdateUserType(userTypeRepository);

  const overwritingUserType = await updateUserType.execute({
    id: newUserType.id,
    description: "Moderador",
  });

  expect(overwritingUserType.description).toBe("Moderador");
});

test("should be throw an error when id is empty", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new UpdateUserType(userTypeRepository);

  await expect(
    createUserType.execute({
      id: "",
      description: "Administrador",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description is empty", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new UpdateUserType(userTypeRepository);

  await expect(
    createUserType.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "",
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const updateUserType = new UpdateUserType(userTypeRepository);

  await expect(
    updateUserType.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "Administrador",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists in other User Type", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  await createUserType.execute({
    description: "Administrador",
  });

  const newUserType = await createUserType.execute({
    description: "Monkey Tree",
  });

  const updateUserType = new UpdateUserType(userTypeRepository);
  await expect(
    updateUserType.execute({
      id: newUserType.id,
      description: "Administrador",
    })
  ).rejects.toThrow();
});

test("should be throw an error when has no changes", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const userType = await createUserType.execute({
    description: "Administrador",
  });

  const updateUserType = new UpdateUserType(userTypeRepository);
  const updatedUserType = updateUserType.execute({
    id: userType.id,
    description: "Administrador",
  });

  await expect(updatedUserType).rejects.toThrow();
});

test("should be throw an error when description is invalid", async () => {
  const userTypeRepository = new UserTypeRepositoryMem();
  const createUserType = new CreateUserType(userTypeRepository);
  const userType = await createUserType.execute({
    description: "Administrador",
  });

  const updateUserType = new UpdateUserType(userTypeRepository);

  const input = {
    id: userType.id,
    description: [],
  } as any;

  const updatedUserType = updateUserType.execute(input);

  await expect(updatedUserType).rejects.toThrow();
});
