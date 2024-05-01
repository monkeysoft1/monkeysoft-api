import User from "../../core/entity/User";
import UserRepository from "../../infra/repository/UserRepository";
import UserTypeRepository from "../../infra/repository/UserTypeRepository";
import TestServer from "./setup";

jest.mock("../../infra/repository/UserRepository");
jest.mock("../../infra/repository/UserTypeRepository");

describe("User controller", () => {
  const ts = new TestServer();

  beforeAll(async () => {
    await ts.start();
  });

  afterAll(() => {
    ts.close();
  });

  test("Should create a user (/user)", async () => {
    (UserTypeRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue({
        id: "92fb509f-4ac9-4176-93e6-e3940cbfc87b",
        description: "Admin",
      }),
    }));

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.post("/user", {
      name: "Anderson Silva",
      email: "andersonsstr@gmail.com",
      phone_number: "31971318057",
      active: true,
      id_user_type: "92fb509f-4ac9-4176-93e6-e3940cbfc87b",
      password: "4b9806571765609aec35683e8183e23f",
    });

    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("userType");
    expect(data).toHaveProperty("phone_number");
    expect(data).toHaveProperty("active");
  });

  test("Should throw an error when id_user_type user is empty", async () => {
    (UserTypeRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue(undefined),
    }));

    (UserRepository as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.post("/user", {
      name: "Anderson Silva",
      email: "andersonsstr@gmail.com",
      phone_number: "31971318057",
      active: true,
      id_user_type: "",
      password: "4b9806571765609aec35683e8183e23f",
    });

    expect(status).toBe(400);
    expect(data.message).toBe("Tipo de usuário informado não existe");
  });

  test("Should throw an error when e-mail exist", async () => {
    (UserTypeRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue({
        id: "92fb509f-4ac9-4176-93e6-e3940cbfc87b",
        description: "Admin",
      }),
    }));

    (UserRepository as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(undefined),
      getByEmail: jest.fn().mockResolvedValue({
        id: "7d49b779-76cf-4a76-8d78-d6c6e1185fcf",
      }),
    }));

    const { data, status } = await ts.client.post("/user", {
      name: "Anderson Silva",
      email: "andersonsstr@gmail.com",
      phone_number: "31971318057",
      active: true,
      id_user_type: "",
      password: "4b9806571765609aec35683e8183e23f",
    });

    expect(status).toBe(400);
    expect(data.message).toBe("O e-mail informado já foi cadastrado");
  });

  test("Should get all users (/user)", async () => {
    const user = new User();
    user.id = "123";
    user.name = "Anderson Silva";
    user.email = "andersonsstr@gmail.com";

    const result = {
      list: [user],
      total: 1,
      total_page: 1,
    };

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getAll: jest.fn().mockResolvedValue(result),
    }));

    const { data, status } = await ts.client.get("/user");

    expect(status).toBe(200);
    expect(data).toHaveProperty("list");
  });

  test("Should get a user (/user/:id)", async () => {
    const user = new User();
    user.id = "123";
    user.name = "Anderson Silva";
    user.email = "andersonsstr@gmail.com";
    (UserRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue(user),
    }));
    const { data, status } = await ts.client.get("/user/123");

    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
  });

  test("Should throw an error when user not exist", async () => {
    (UserRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.get("/user/123");

    expect(status).toBe(404);
    expect(data.message).toBe("Usuario não encontrado");
  });

  test("Should update a user (/user)", async () => {
    (UserTypeRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue({
        id: "92fb509f-4ac9-4176-93e6-e3940cbfc87b",
        description: "Admin",
      }),
    }));

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(undefined),
      getById: jest.fn().mockResolvedValue({
        id: "123",
        name: "Anderson Silva",
        email: "andersonsstr@gmail.com",
        phone_number: "31971318057",
        active: true,
        password: "4b9806571765609aec35683e8183e23f",
        userType: { id: "92fb509f-4ac9-4176-93e6-e3940cbfc87b" },
      }),
      update: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.put("/user/123", {
      active: false,
      name: "Marcos N.",
      phone_number: "3198978489",
    });

    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("id_user_type");
    expect(data).toHaveProperty("phone_number");
    expect(data).toHaveProperty("active");
    expect(data.active).toBe(false);
  });
});
