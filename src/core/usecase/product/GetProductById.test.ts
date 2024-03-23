import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProduct from "./CreateProduct";
import GetProductById from "./GetProductById";

test("should be search a product by id", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getProductById = new GetProductById(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = await createProduct.execute({
    name: "relatorio-adm",
    id_software: software.id,
    active: true,
  });

  const products = await getProductById.execute(product);

  expect(products).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getProductById = new GetProductById(productRepository, softwareRepository);

  await expect(getProductById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getProductById = new GetProductById(productRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = await createProduct.execute({
    name: "relatorio-adm",
    id_software: software.id,
    active: true,
  });

  product.id = "79db678a-eb17-430c-b03a";

  await expect(getProductById.execute(product)).rejects.toThrow();
});
