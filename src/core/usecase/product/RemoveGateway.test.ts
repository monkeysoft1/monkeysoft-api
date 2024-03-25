import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateGateway from "../gateway/CreateGateway";
import CreateSoftware from "../software/CreateSoftware";
import AddGateway from "./AddGateway";
import CreateProduct from "./CreateProduct";
import RemoveGateway from "./RemoveGateway";

test("should be remove gateway product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano básico",
    description: "Plano básico ideal para conhecer o produto",
    price: 20.6,
    active: true,
  });

  await addGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    id_gateway_product: "planBasic01",
    active: true,
  });

  const removedGateway = await removeGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
  });

  expect(removedGateway.message).toBe("Gateway removido do Produto com sucesso.");
});

test("should throw an error when id_gateway is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const gateway = removeGateway.execute({
    id_gateway: "",
    id: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const gateway = removeGateway.execute({
    id_gateway: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id: "",
  });

  await expect(gateway).rejects.toThrow();
});

test("should throw an error when product not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createGateway = new CreateGateway(gatewayRepositoryMem);
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const productGateway = removeGateway.execute({
    id_gateway: gateway.id,
    id: "06b95fba-b4b5-4671",
  });

  await expect(productGateway).rejects.toThrow();
});

test("should throw an error when gateway not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepositoryMem = new GatewayRepositoryMem();

  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Mercado Pago",
    active: true,
  });

  const productGateway = removeGateway.execute({
    id_gateway: "06b95fba-b4b5-4671",
    id: product.id,
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
  const addGateway = new AddGateway(productRepository, gatewayRepositoryMem);
  const removeGateway = new RemoveGateway(productRepository, gatewayRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const gatewayTwo = await createGateway.execute({
    description: "clean-messages",
    payment_gateway_key: "mercPayment02",
  });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  await addGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    id_gateway_product: "planBasic01",
    active: true,
  });

  const removedGateway = removeGateway.execute({
    id_gateway: gatewayTwo.id,
    id: product.id,
  });

  await expect(removedGateway).rejects.toThrow();
});
