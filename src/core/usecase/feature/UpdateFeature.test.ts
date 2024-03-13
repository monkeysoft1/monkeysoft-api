import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateFeature from "./CreateFeature";
import UpdateFeature from "./UpdateFeature";

test("should be update feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const newFeature = await createFeature.execute({
    id_software: software.id,
    name: "add_user",
    active: true,
    description: "Permissão para adicionar usuário",
  });

  const updateSofware = new UpdateFeature(featureRepository, softwareRepository);

  const overwritingSofware = await updateSofware.execute({
    id: newFeature.id,
    id_software: newFeature.id_software,
    name: "Monkey New Zap",
    active: false,
    description: "Serviço de whats",
    url: "https://monkeysoft.com.br/portal/adduser",
  });

  expect(overwritingSofware.name).toBe("Monkey New Zap");
});

test("should be update partial feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    id_software: software.id,
    name: "login",
  });

  const updatedFeature = await updateFeature.execute({
    id: feature.id,
    name: "Monkey Zap",
  });

  expect(updatedFeature.active).toBe(feature.active);
});

test("should be throw an error when name is equal an other feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await createFeature.execute({
    id_software: software.id,
    name: "login",
  });

  const logoutFeature = await createFeature.execute({
    id_software: software.id,
    name: "logout",
  });

  const updatedFeature = updateFeature.execute({
    id: logoutFeature.id,
    name: "login",
  });

  await expect(updatedFeature).rejects.toThrow();
});
test("should be throw an error when id_software not exists ", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    id_software: software.id,
    name: "login",
  });

  const updatedFeature = updateFeature.execute({
    id: feature.id,
    id_software: "123",
  });

  await expect(updatedFeature).rejects.toThrow();
});

test("should be throw an error when id is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);

  await expect(
    updateFeature.execute({
      id: "",
      name: "Monkey Zap",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);

  await expect(
    updateFeature.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateFeature = new UpdateFeature(featureRepository, softwareRepository);

  await expect(
    updateFeature.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "Monkey Zap",
      active: false,
      description: "Serviço de whats",
    })
  ).rejects.toThrow();
});
