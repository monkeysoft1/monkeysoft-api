import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import ProductRepositoryMem from "../../../infra/repository/ProductRepositoryMem";
import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateFeature from "../feature/CreateFeature";
import CreateProduct from "../product/CreateProduct";
import CreateProfile from "../profile/CreateProfile";
import CreateSoftware from "./CreateSoftware";
import GetSoftwareById from "./GetSoftwareById";

test("should be search a software by id", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const productRepository = new ProductRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const profileRepository = new ProfileRepositoryMem();

  const getSoftwareById = new GetSoftwareById(
    softwareRepository,
    profileRepository,
    featureRepository,
    productRepository
  );

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
    active: true,
    description: "Envio de mensagens",
  });

  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  await createProfile.execute({
    name: "Administrador",
    id_software: software.id,
    active: true,
  });

  const createProduct = new CreateProduct(productRepository, softwareRepository);

  await createProduct.execute({
    name: "Plano básico",
    id_software: software.id,
    active: true,
    description: "Ideal para quem quer conhecer o produto",
    price: 80.5,
  });

  const softwares = await getSoftwareById.execute(software);

  expect(softwares).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const productRepository = new ProductRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const profileRepository = new ProfileRepositoryMem();
  const getSoftwareById = new GetSoftwareById(
    softwareRepository,
    profileRepository,
    featureRepository,
    productRepository
  );

  await expect(getSoftwareById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const productRepository = new ProductRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const profileRepository = new ProfileRepositoryMem();
  const getSoftwareById = new GetSoftwareById(
    softwareRepository,
    profileRepository,
    featureRepository,
    productRepository
  );

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  software.id = "79db678a-eb17-430c-b03a";

  await expect(getSoftwareById.execute(software)).rejects.toThrow();
});
