import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";

test("should be update product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const newProduct = await createProduct.execute({
    id_software: software.id,
    name: "Plano básico",
    active: true,
    description: "Melhor plano para conhecer a ferramenta",
  });

  const updateProduct = new UpdateProduct(productRepository, softwareRepository);

  const overwritingProduct = await updateProduct.execute({
    id: newProduct.id,
    id_software: newProduct.id_software,
    name: "Plano intermediário",
    active: false,
    description: "Valorize o seu negócio",
    price: 28.7,
  });

  expect(overwritingProduct.name).toBe("Plano intermediário");
});

test("should be throw an error when name is equal an other product", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProduct = new UpdateProduct(productRepository, softwareRepository);
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await createProduct.execute({
    id_software: software.id,
    name: "Plano básico",
  });

  const secondProduct = await createProduct.execute({
    id_software: software.id,
    name: "Plano intermediário",
  });

  const updatedProduct = updateProduct.execute({
    id: secondProduct.id,
    name: "Plano básico",
  });

  await expect(updatedProduct).rejects.toThrow();
});
test("should be throw an error when id_software not exists ", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProduct = new UpdateProduct(productRepository, softwareRepository);
  const createProduct = new CreateProduct(productRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const product = await createProduct.execute({
    id_software: software.id,
    name: "Plano básico",
  });

  const updatedProduct = updateProduct.execute({
    id: product.id,
    id_software: "123",
    name: "Plano Intermediário",
  });

  await expect(updatedProduct).rejects.toThrow();
});

test("should be throw an error when id is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProduct = new UpdateProduct(productRepository, softwareRepository);

  await expect(
    updateProduct.execute({
      id: "",
      name: "Plano básico",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name is empty", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProduct = new UpdateProduct(productRepository, softwareRepository);

  await expect(
    updateProduct.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const productRepository = new ProductRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProduct = new UpdateProduct(productRepository, softwareRepository);

  await expect(
    updateProduct.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "Monkey Zap",
      active: false,
      description: "Serviço de whats",
    })
  ).rejects.toThrow();
});
