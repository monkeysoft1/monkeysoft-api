import User from "../../core/entity/User";
import SessionRepository from "../../infra/repository/SessionRepository";
import UserRepository from "../../infra/repository/UserRepository";
import TestServer from "./setup";

jest.mock("../../infra/repository/SessionRepository");
jest.mock("../../infra/repository/UserRepository");

describe("Session Controller", () => {
  const ts = new TestServer();

  beforeAll(async () => {
    await ts.start();
  });

  afterAll(() => {
    ts.close();
  });

  test("Should create a session (/signin)", async () => {
    const user = new User();
    user.email = "teste@gmail.com";
    user.password = "202cb962ac59075b964b07152d234b70";
    user.active = true;

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(user),
      getByCredential: jest.fn().mockResolvedValue(user),
    }));

    (SessionRepository as jest.Mock).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(undefined),
    }));

    const { data, status } = await ts.client.post("/signin", {
      email: "teste@gmail.com",
      password: "202cb962ac59075b964b07152d234b70",
    });

    expect(status).toBe(200);
    expect(data).toHaveProperty("timeout");
    expect(data.timeout).toBe(3600);
    expect(data).toHaveProperty("token");
    expect(data.token).toBeTruthy();
  });

  test("Should throw an error when user is inactive", async () => {
    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(undefined),
    }));

    const { status } = await ts.client.post("/signin", {
      email: "teste@gmail.com",
      password: "202cb962ac59075b964b07152d234b70",
    });

    expect(status).toBe(404);
  });

  test("Should throw an error when user not exists", async () => {
    const user = new User();
    user.email = "teste@gmail.com";
    user.password = "202cb962ac59075b964b07152d234b70";
    user.active = false;

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(user),
    }));

    const { status } = await ts.client.post("/signin", {
      email: "teste@gmail.com",
      password: "202cb962ac59075b964b07152d234b70",
    });

    expect(status).toBe(400);
  });
  test("Should throw an error when user credentials are invalid", async () => {
    const user = new User();
    user.email = "teste@gmail.com";
    user.password = "202cb962ac59075b964b07152d234b70";
    user.active = true;

    (UserRepository as jest.Mock).mockImplementation(() => ({
      getByEmail: jest.fn().mockResolvedValue(user),
      getByCredential: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    }));

    const { status } = await ts.client.post("/signin", {
      email: "teste@gmail.com",
      password: "202cb962ac59075b964b07152d234b70",
    });

    expect(status).toBe(400);
  });
  test("Should throw an error when user email is not defined", async () => {
    const { status } = await ts.client.post("/signin");

    expect(status).toBe(400);
  });
  test("Should throw an error when user password is not defined", async () => {
    const { status } = await ts.client.post("/signin", { email: "teste" });

    expect(status).toBe(400);
  });
});
