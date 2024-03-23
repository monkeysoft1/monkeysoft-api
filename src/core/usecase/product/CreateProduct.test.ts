import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProduct from "./CreateProduct";

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
test("should be create a product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano Básico",
    active: true,
    price: 25,
    description: "Plano de baixo custo mas com inúmeras vantagens",
  });

  expect(product.name).toBe("Plano Básico");
});

test("should be create a product with price less than zero", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await expect(
    createProduct.execute({
      id_software: software.id,
      name: "Basic plan",
      active: true,
      price: -24,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await expect(
    createProduct.execute({
      id_software: software.id,
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const productData = {
    id_software: software.id,
    name: "Plano Básico",
    active: true,
  };
  await createProduct.execute(productData);

  await expect(createProduct.execute(productData)).rejects.toThrow();
});

test("should be throw an error when name to long", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const productData = {
    id_software: software.id,
    name: generateLongString(256),
    active: true,
  };

  await expect(createProduct.execute(productData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const productData = {
    id_software: software.id,
    name: "Plano básico",
    active: true,
    description: generateLongString(256),
  };

  await expect(createProduct.execute(productData)).rejects.toThrow();
});

test("should throw an error with product id_software is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = createProduct.execute({
    id_software: "",
    name: "Plano Básico",
    active: true,
    price: 25,
    description: "Plano de baixo custo mas com inúmeras vantagens",
  });

  await expect(product).rejects.toThrow();
});
test("should throw an error with product id_software is undefined", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = createProduct.execute({
    name: "Plano Básico",
    active: true,
    price: 25,
    description: "Plano de baixo custo mas com inúmeras vantagens",
  });

  await expect(product).rejects.toThrow();
});

test("should throw an error when software not exists", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const product = createProduct.execute({
    id_software: "000",
    name: "Plano Básico",
    active: true,
    price: 25,
    description: "Plano de baixo custo mas com inúmeras vantagens",
  });

  await expect(product).rejects.toThrow();
});
