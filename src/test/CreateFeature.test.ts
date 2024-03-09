import CreateFeature from "../core/usecase/CreateFeature";
import FeatureRepositoryMem from "../infra/repository/FeatureRepositoryMem";

test("should be create a feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const feature = await createFeature.execute({
    name: "relatorio-adm",
    active: true,
    description: "Permissão de relatório"
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

test("should be throw an error when name to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const featureData = {
    name: generateLongString(256),
    active: true,
  };
  await createFeature.execute(featureData);

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});


test("should be throw an error when url to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const featureData = {
    name: "full-permission",
    active: true,
    url: generateLongString(256)
  };
  await createFeature.execute(featureData);

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const createFeature = new CreateFeature(featureRepository);
  const featureData = {
    name: "basic-permission",
    active: true,
    description: generateLongString(256)
  };
  await createFeature.execute(featureData);

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

function generateLongString(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
 }
 