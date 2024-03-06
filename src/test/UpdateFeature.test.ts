import CreateFeature from "../core/usecase/CreateFeature";
import UpdateFeature from "../core/usecase/UpdateFeature";
import FeatureRepositoryMem from "../infra/repository/FeatureRepositoryMem";

test("should be update feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const newFeature = await createFeature.execute({
    name: "add_user",
    active: true,
    description: "Permissão para adicionar usuário",
  });

  const updateSofware = new UpdateFeature(featureRepository);

  const overwritingSofware = await updateSofware.execute({
    id: newFeature.id,
    name: "Monkey New Zap",
    active: false,
    description: "Serviço de whats",
    url: "https://monkeysoft.com.br/portal/adduser",
  });

  expect(overwritingSofware.name).toBe("Monkey New Zap");
});

test("should be throw an error when id is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new UpdateFeature(featureRepository);

  await expect(
    createFeature.execute({
      id: "",
      name: "Monkey Zap",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new UpdateFeature(featureRepository);

  await expect(
    createFeature.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const updateSofware = new UpdateFeature(featureRepository);

  await expect(
    updateSofware.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "Monkey Zap",
      active: false,
      description: "Serviço de whats",
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists in other feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  await createFeature.execute({
    name: "Monkey Zap",
    active: true,
    description: "Serviço de whats",
  });

  var newFeature = await createFeature.execute({
    name: "Monkey Tree",
    active: true,
    description: "Serviço de whats",
  });

  const updateSofware = new UpdateFeature(featureRepository);
  await expect(
    updateSofware.execute({
      id: newFeature.id,
      name: "Monkey Zap",
      active: false,
      description: "Serviço de whats",
    })
  ).rejects.toThrow();
});
