import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import CreateGateway from "./CreateGateway";
import GetGatewayById from "./GetGatewayById";

test("should be search a gateway by id", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const getGatewayById = new GetGatewayById(gatewayRepository);

  const createGateway = new CreateGateway(gatewayRepository);

  const gateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const gateways = await getGatewayById.execute(gateway);

  expect(gateways).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const getGatewayById = new GetGatewayById(gatewayRepository);

  await expect(getGatewayById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const getGatewayById = new GetGatewayById(gatewayRepository);

  const createGateway = new CreateGateway(gatewayRepository);

  const gateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  gateway.id = "79db678a-eb17-430c-b03a";

  await expect(getGatewayById.execute(gateway)).rejects.toThrow();
});
