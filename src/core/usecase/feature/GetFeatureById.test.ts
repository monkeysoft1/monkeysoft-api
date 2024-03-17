import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateFeature from "./CreateFeature";
import GetFeatureById from "./GetFeatureById";

test("should be search a feature by id", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getFeatureById = new GetFeatureById(featureRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const feature = await createFeature.execute({
    name: "relatorio-adm",
    id_software: software.id,
    active: true,
  });

  const features = await getFeatureById.execute(feature);

  expect(features).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getFeatureById = new GetFeatureById(featureRepository, softwareRepository);

  await expect(getFeatureById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const getFeatureById = new GetFeatureById(featureRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const feature = await createFeature.execute({
    name: "relatorio-adm",
    id_software: software.id,
    active: true,
  });

  feature.id = "79db678a-eb17-430c-b03a";

  await expect(getFeatureById.execute(feature)).rejects.toThrow();
});
