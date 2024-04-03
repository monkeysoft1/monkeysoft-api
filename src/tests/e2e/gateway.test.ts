import Gateway from "../../core/entity/Gateway";
import GatewayRepository from "../../infra/repository/GatewayRepository";
import TestServer from "./setup";

jest.mock("../../infra/repository/GatewayRepository");

describe("Gateway controller", () => {
  const ts = new TestServer();

  beforeAll(async () => {
    await ts.start();
  });

  afterAll(() => {
    ts.close();
  });

  test("Should get a gateway (/gateway/:id)", async () => {
    const gateway = new Gateway();
    gateway.description = "Teste 123";
    gateway.payment_gateway_key = "123";
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getById: jest.fn().mockResolvedValue(gateway),
    }));
    const { data } = await ts.client.get("/gateway/123");
  });
});
