import GatewayRepositoryMem from "../../../infra/repository/GatewayRepository.Mem";
import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateGateway from "../gateway/CreateGateway";
import CreateSoftware from "../software/CreateSoftware";
import AddGateway from "./AddGateway";
import CreateProduct from "./CreateProduct";
import GetProductById from "./GetProductById";

test("should be search a product by id", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepository = new GatewayRepositoryMem();
  const getProductById = new GetProductById(
    productRepository,
    gatewayRepository,
    softwareRepository
  );
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = await createProduct.execute({
    name: "Plano Básico",
    id_software: software.id,
    description: "Plano básico ideal para conhecer o produto",
    price: 50.23,
    active: true,
  });

  const createGateway = new CreateGateway(gatewayRepository);

  const gateway = await createGateway.execute({
    description: "Mercado Pago",
    payment_gateway_key: "mercPayment01",
  });

  const addGateway = new AddGateway(productRepository, gatewayRepository);

  await addGateway.execute({
    id_gateway: gateway.id,
    id: product.id,
    id_gateway_product: "plan01",
    active: true,
  });

  const productGateways = await getProductById.execute(product);

  expect(productGateways).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepository = new GatewayRepositoryMem();
  const getProductById = new GetProductById(
    productRepository,
    gatewayRepository,
    softwareRepository
  );

  await expect(getProductById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const gatewayRepository = new GatewayRepositoryMem();
  const getProductById = new GetProductById(
    productRepository,
    gatewayRepository,
    softwareRepository
  );
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = await createProduct.execute({
    name: "Plano Básico",
    id_software: software.id,
    active: true,
  });

  product.id = "79db678a-eb17-430c-b03a";

  await expect(getProductById.execute(product)).rejects.toThrow();
});
