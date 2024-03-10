import CreateFeature from "../core/usecase/CreateFeature";
import CreateSoftware from "../core/usecase/CreateSoftware";
import FeatureRepositoryMem from "../infra/repository/FeatureRepositoryMem";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
test("should be create a feature", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    id_software: software.id,
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
    description: "Permissão de relatório",
  });

  expect(feature.name).toBe("relatorio-adm");
  expect(feature.is_page).toBe(true);
});
test("should be create a feature without url", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    id_software: software.id,
    name: "relatorio-adm",
    active: true,
  });

  expect(feature.is_page).toBe(false);
});

test("should be throw an error when name is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await expect(
    createFeature.execute({
      id_software: software.id,
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const featureData = {
    id_software: software.id,
    name: "relatorio-adm",
    active: true,
  };
  await createFeature.execute(featureData);

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

test("should be throw an error when name to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const featureData = {
    id_software: software.id,
    name: generateLongString(256),
    active: true,
  };

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

test("should be throw an error when url to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const featureData = {
    id_software: software.id,
    name: "full-permission",
    active: true,
    url: generateLongString(256),
  };

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const featureData = {
    id_software: software.id,
    name: "basic-permission",
    active: true,
    description: generateLongString(256),
  };

  await expect(createFeature.execute(featureData)).rejects.toThrow();
});

test("should throw an error with feature id_software is empty", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const feature = createFeature.execute({
    id_software: "",
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
    description: "Permissão de relatório",
  });

  await expect(feature).rejects.toThrow();
});
test("should throw an error with feature id_software is undefined", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const feature = createFeature.execute({
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
    description: "Permissão de relatório",
  });

  await expect(feature).rejects.toThrow();
});

test("should throw an error when software not exists", async () => {
  const featureRepository = new FeatureRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createFeature = new CreateFeature(featureRepository, softwareRepository);

  const feature = createFeature.execute({
    id_software: "000",
    name: "relatorio-adm",
    active: true,
    url: "https://monkeysoft.com.br",
    description: "Permissão de relatório",
  });

  await expect(feature).rejects.toThrow();
});
