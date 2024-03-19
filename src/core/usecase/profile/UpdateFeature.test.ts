import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateFeature from "../feature/CreateFeature";
import CreateSoftware from "../software/CreateSoftware";
import AddFeature from "./AddFeature";
import CreateProfile from "./CreateProfile";
import UpdateFeature from "./UpdateFeature";

test("should be update feature profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);
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

  const featureUpdated = await updateFeature.execute({
    id_feature: feature.id,
    id_profile: profile.id,
    active: true,
    create: true,
    delete: true,
    read: true,
    update: false,
  });

  expect(featureUpdated.delete).toBe(true);
});

test("should throw an error when id_feature is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);

  const feature = updateFeature.execute({
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
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);

  const feature = updateFeature.execute({
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
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const profileFeature = updateFeature.execute({
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
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const profileFeature = updateFeature.execute({
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

test("should throw an error when link feature with profile not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const updateFeature = new UpdateFeature(profileRepository, featureRepositoryMem);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const featureTwo = await createFeature.execute({
    name: "clean-messages",
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

  const featureUpdated = updateFeature.execute({
    id_feature: featureTwo.id,
    id_profile: profile.id,
    active: true,
    create: true,
    delete: true,
    read: true,
    update: false,
  });

  await expect(featureUpdated).rejects.toThrow();
});
