import SoftwareRepository from "../../infra/repository/SoftwareRepository";
import TestServer from "./setup";

jest.mock("../../infra/repository/SoftwareRepository");

describe("Software controller", () => {
  const ts = new TestServer();

  beforeAll(async () => {
    await ts.start();
  });

  afterAll(() => {
    ts.close();
  });

  test("Should create a software (/software)", async () => {
    (SoftwareRepository as jest.Mock).mockImplementation(() => ({
      getByName: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    }));
    const { data, status } = await ts.client.post("/software", {
      name: "monkey soft",
      description: "teste description",
    });

    expect(status).toBe(200);
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("description");
    expect(data).toHaveProperty("active");
    expect(data).toHaveProperty("created_on");
  });
});
