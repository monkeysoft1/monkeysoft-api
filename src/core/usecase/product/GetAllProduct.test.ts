import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProduct from "./CreateProduct";
import GetAllProducts from "./GetAllProducts";

test("should be create a product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);
  const getAllProducts = new GetAllProducts(productRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await createProduct.execute({
    id_software: software.id,
    name: "relatorio-adm",
    active: true,
    price: 20.55,
    description: "Permissão de relatório",
  });

  const products = await getAllProducts.execute({});

  expect(products).toHaveProperty(["list"]);
  expect(products).toHaveProperty(["total"]);
  expect(products).toHaveProperty(["total_page"]);
});
