import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateGateway from "../gateway/CreateGateway";
import CreateSoftware from "../software/CreateSoftware";
import AddGateway from "./AddGateway";
import CreateProduct from "./CreateProduct";

test("should be add gateway to a product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const productGateway = await addGateway.execute({
    id_gateway: gateway.id,
    id_product: product.id,
    id_gateway_product: "basicPlan01",
    active: true,
  });

  expect(productGateway.id_gateway_product).toBe("basicPlan01");
});

test("should throw an error when id_gateway is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const gateway = addGateway.execute({
    id_product: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_gateway: "",
    id_gateway_product: "basicPlan01",
    active: true,
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when id_product is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const gateway = addGateway.execute({
    id_gateway: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_product: "",
    id_gateway_product: "basicPlan01",
    active: true,
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when product not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const productGateway = addGateway.execute({
    id_gateway: gateway.id,
    id_product: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_gateway_product: "basicPlan01",
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
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const productGateway = addGateway.execute({
    id_gateway: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_product: product.id,
    id_gateway_product: "basicPlan01",
    active: true,
  });

  await expect(productGateway).rejects.toThrow();
});

test("should throw an error when product_gateway is duplicated", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano Básico",
    description: "Plano ideal para quem quer conhecer o serviço",
    price: 30.7,
    active: true,
  });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  await addGateway.execute({
    id_gateway: gateway.id,
    id_product: product.id,
    id_gateway_product: "basicPlan01",
    active: true,
  });

  const productGatewayRepeated = addGateway.execute({
    id_gateway: gateway.id,
    id_product: product.id,
    id_gateway_product: "basicPlan01",
    active: true,
  });

  await expect(productGatewayRepeated).rejects.toThrow();
});
