import CreateFeature from "../core/usecase/CreateFeature";
import CreateSoftware from "../core/usecase/CreateSoftware";
import GetAllFeatures from "../core/usecase/GetAllFeatures";
import FeatureRepositoryMem from "../infra/repository/FeatureRepositoryMem";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

test("should be create a feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);
  const getAllFeatures = new GetAllFeatures(featureRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await createFeature.execute({
    id_software: software.id,
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
    description: "Permissão de relatório",
  });

  const features = await getAllFeatures.execute({});

  expect(features).toHaveProperty(["list"]);
  expect(features).toHaveProperty(["total"]);
  expect(features).toHaveProperty(["total_page"]);
});
