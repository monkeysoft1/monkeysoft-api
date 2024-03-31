import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateGateway from "../gateway/CreateGateway";
import CreateSoftware from "../software/CreateSoftware";
import AddGateway from "./AddGateway";
import CreateProduct from "./CreateProduct";
import UpdateGateway from "./UpdateGateway";

test("should be update gateway product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  await addGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    active: true,
    id_gateway_product: "plan01",
  });

  const gatewayUpdated = await updateGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    id_gateway_product: "plan02",
    active: true,
  });

  expect(gatewayUpdated.id_gateway_product).toBe("plan02");
});

test("should throw an error when id_gateway id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);

  const gateway = updateGateway.execute({
    id: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_gateway: "",
    active: true,
    id_gateway_product: "plan01",
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);

  const gateway = updateGateway.execute({
    id: "",
    id_gateway: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    active: true,
    id_gateway_product: "plan01",
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when product not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const productGateway = updateGateway.execute({
    id_gateway: gateway.id,
    id: "06b95fba-b4b5-4671",
    id_gateway_product: "merc01",
    active: true,
  });

  await expect(productGateway).rejects.toThrow();
});

test("should throw an error when gateway not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano básico",
    description: "Plano ideal para conhecer o produto.",
    price: 30.8,
    active: true,
  });

  const productGateway = updateGateway.execute({
    id_gateway: "06b95fba-b4b5-4671",
    id: product.id,
    id_gateway_product: "plan01",
    active: true,
  });

  await expect(productGateway).rejects.toThrow();
});

test("should throw an error when link gateway with product not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const updateGateway = new UpdateGateway(productRepository, gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const gatewayTwo = await createGateway.execute({
    description: "Stripe",
    payment_gateway_key: "stripePayment01",
  });

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano Básico",
    price: 50.5,
    description: "user-premium",
    active: true,
  });

  await addGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    id_gateway_product: "plan01",
    active: true,
  });

  const gatewayUpdated = updateGateway.execute({
    id_gateway: gatewayTwo.id,
    id: product.id,
    id_gateway_product: "plan02",
    active: true,
  });

  await expect(gatewayUpdated).rejects.toThrow();
});
