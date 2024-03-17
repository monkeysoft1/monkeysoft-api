import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import CreateGateway from "./CreateGateway";
import UpdateGateway from "./UpdateGateway";

test("should be update gateway", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const newGateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const updateGateway = new UpdateGateway(gatewayRepository);

  const overwritingGateway = await updateGateway.execute({
    id: newGateway.id,
    description: "New Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  expect(overwritingGateway.description).toBe("New Stripe");
});

test("should be throw an error when id is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new UpdateGateway(gatewayRepository);

  await expect(
    createGateway.execute({
      id: "",
      description: "Stripe",
      payment_gateway_key: "stripe-tbt-4002-8922",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const updateGateway = new UpdateGateway(gatewayRepository);

  await expect(
    updateGateway.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "",
      payment_gateway_key: "stripe-tbt-4002-8922",
    })
  ).rejects.toThrow();
});

test("should be throw an error when payment_gateway_key is empty", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new UpdateGateway(gatewayRepository);

  await expect(
    createGateway.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "Stripe",
      payment_gateway_key: "",
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const updateGateway = new UpdateGateway(gatewayRepository);

  await expect(
    updateGateway.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "Stripe",
      payment_gateway_key: "stripe-tbt-4002-8922",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists in other gateway", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const newGateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const updateGateway = new UpdateGateway(gatewayRepository);
  await expect(
    updateGateway.execute({
      id: newGateway.id,
      description: "Stripe",
      payment_gateway_key: "stripe-tbt-4002-8922",
    })
  ).rejects.toThrow();
});
test("should be throw an error when has no changes", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const updateGateway = new UpdateGateway(gatewayRepository);
  const updatedGateway = updateGateway.execute({
    id: gateway.id,
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  await expect(updatedGateway).rejects.toThrow();
});
test("should be throw an error when description is invalid", async () => {
  const gatewayRepository = new GatewayRepositoryMem();
  const createGateway = new CreateGateway(gatewayRepository);
  const gateway = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripe-tbt-4002-8922",
  });

  const updateGateway = new UpdateGateway(gatewayRepository);

  const input = {
    id: gateway.id,
    description: [],
  } as any;

  const updatedGateway = updateGateway.execute(input);

  await expect(updatedGateway).rejects.toThrow();
});
