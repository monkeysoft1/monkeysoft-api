import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateFeature from "../feature/CreateFeature";
import CreateSoftware from "../software/CreateSoftware";
import AddFeature from "./AddFeature";
import CreateProfile from "./CreateProfile";

test("should be add feature to a profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const profileFeature = await addFeature.execute({
    id_feature: feature.id,
    id_profile: profile.id,
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  expect(profileFeature.read).toBe(true);
});

test("should throw an error when id_feature is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const feature = addFeature.execute({
    id_feature: "",
    id_profile: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  await expect(feature).rejects.toThrow();
});

test("should throw an error when id_profile is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const feature = addFeature.execute({
    id_feature: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_profile: "",
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  await expect(feature).rejects.toThrow();
});

test("should throw an error when profile not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const profileFeature = addFeature.execute({
    id_feature: feature.id,
    id_profile: "06b95fba-b4b5-4671",
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  await expect(profileFeature).rejects.toThrow();
});

test("should throw an error when feature not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const profileFeature = addFeature.execute({
    id_feature: "06b95fba-b4b5-4671",
    id_profile: profile.id,
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  await expect(profileFeature).rejects.toThrow();
});

test("should throw an error when feature is duplicated", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  await addFeature.execute({
    id_feature: feature.id,
    id_profile: profile.id,
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  const profileFeatureRepeated = addFeature.execute({
    id_feature: feature.id,
    id_profile: profile.id,
    active: true,
    create: true,
    delete: false,
    read: true,
    update: false,
  });

  await expect(profileFeatureRepeated).rejects.toThrow();
});
