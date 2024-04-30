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

  test("Should throw an error when name user is empty", async () => {
    (UserRepository as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.post("/user", {
      name: "",
      email: "andersonsstr@gmail.com",
      phone_number: "31971318057",
      active: true,
      id_user_type: "92fb509f-4ac9-4176-93e6-e3940cbfc87b",
      password: "4b9806571765609aec35683e8183e23f",
    });

    expect(status).toBe(400);
    expect(data.message).toBe("O nome do usuário não pode ser vazio");
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

    console.log(data);
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

    console.log(data);
    expect(status).toBe(400);
    expect(data.message).toBe("O e-mail informado já foi cadastrado");
  });
});
