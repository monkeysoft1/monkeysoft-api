import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateFeature from "../feature/CreateFeature";
import CreateSoftware from "../software/CreateSoftware";
import AddFeature from "./AddFeature";
import CreateProfile from "./CreateProfile";
import RemoveFeature from "./RemoveFeatureFromProfile";

test("should be remove feature profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

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

  const removedFeature = await removeFeature.execute({
    id_feature: feature.id,
    id_profile: profile.id,
  });

  expect(removedFeature.message).toBe("Feature removida do perfil com sucesso");
});

test("should throw an error when id_feature is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

  const feature = removeFeature.execute({
    id_feature: "",
    id_profile: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
  });

  await expect(feature).rejects.toThrow();
});

test("should throw an error when id_profile is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

  const feature = removeFeature.execute({
    id_feature: "06b95fba-b4b5-4671-be70-43ca2ae6c4db",
    id_profile: "",
  });

  await expect(feature).rejects.toThrow();
});

test("should throw an error when profile not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createSoftware = new CreateSoftware(softwareRepository);
  const createFeature = new CreateFeature(featureRepositoryMem, softwareRepository);
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const feature = await createFeature.execute({
    name: "send-messages",
    id_software: software.id,
  });

  const profileFeature = removeFeature.execute({
    id_feature: feature.id,
    id_profile: "06b95fba-b4b5-4671",
  });

  await expect(profileFeature).rejects.toThrow();
});

test("should throw an error when feature not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepositoryMem = new FeatureRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  const profileFeature = removeFeature.execute({
    id_feature: "06b95fba-b4b5-4671",
    id_profile: profile.id,
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
  const addFeature = new AddFeature(profileRepository, featureRepositoryMem);
  const removeFeature = new RemoveFeature(profileRepository, featureRepositoryMem);

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

  const removedFeature = removeFeature.execute({
    id_feature: featureTwo.id,
    id_profile: profile.id,
  });

  await expect(removedFeature).rejects.toThrow();
});
