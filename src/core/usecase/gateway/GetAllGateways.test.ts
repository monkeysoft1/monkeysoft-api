
import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import CreateGateway from "./CreateGateway";
import GetAllGateways from "./GetAllGateways";

test("should be list all gateways", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const getAllGateways = new GetAllGateways(gatewayRepository);

  const createGateway = new CreateGateway(gatewayRepository);

  await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922"
  });

  const gateways = await getAllGateways.execute({});

  expect(gateways).toHaveProperty(["list"]);
  expect(gateways).toHaveProperty(["total"]);
  expect(gateways).toHaveProperty(["total_page"]);
});
