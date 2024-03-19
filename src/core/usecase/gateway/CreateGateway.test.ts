import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import CreateGateway from "./CreateGateway";

test("should be create a gateway", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  expect(gateway.description).toBe("Stripe");
});

test("should be throw an error when description is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);

  await expect(
    createGateway.execute({
      description: "",
      payment_gateway_key: "stripe-tbt-4002-8922",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gatewayData = {
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  };
  await createGateway.execute(gatewayData);

  await expect(createGateway.execute(gatewayData)).rejects.toThrow();
});

test("should be throw an error when payment_gateway_key to long", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gatewayData = {
    description: "Stripe",
    payment_gateway_key: generateLongString(256),
  };

  await expect(createGateway.execute(gatewayData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gatewayData = {
    description: generateLongString(256),
    payment_gateway_key: "stripe-tbt-4002-8922",
  };

  await expect(createGateway.execute(gatewayData)).rejects.toThrow();
});

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
