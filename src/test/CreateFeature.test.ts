import CreateFeature from "../core/usecase/CreateFeature";
import FeatureRepositoryMem from "../infra/repository/FeatureRepositoryMem";

test("should be create a feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const feature = await createFeature.execute({
    name: "relatorio-adm",
    active: true,
  });

  expect(feature.name).toBe("relatorio-adm");
});
test("should be create a feature with url", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const feature = await createFeature.execute({
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
  });

  expect(feature.is_page).toBe(true);
});

test("should be throw an error when name is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);

  await expect(
    createFeature.execute({
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const featureData = {
    name: "relatorio-adm",
    active: true,
  };
  await createFeature.execute(featureData);

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});
