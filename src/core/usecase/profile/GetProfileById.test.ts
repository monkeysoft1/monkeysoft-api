import FeatureRepositoryMem from "../../../infra/repository/FeatureRepositoryMem";
import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProfile from "./CreateProfile";
import GetProfileById from "./GetProfileById";

test("should be search a profile by id", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const getProfileById = new GetProfileById(
    profileRepository,
    featureRepository,
    softwareRepository
  );
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const profile = await createProfile.execute({
    name: "Administrador",
    id_software: software.id,
    active: true,
  });

  const profiles = await getProfileById.execute(profile);

  expect(profiles).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const getProfileById = new GetProfileById(
    profileRepository,
    featureRepository,
    softwareRepository
  );

  await expect(getProfileById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const featureRepository = new FeatureRepositoryMem();
  const getProfileById = new GetProfileById(
    profileRepository,
    featureRepository,
    softwareRepository
  );
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const profile = await createProfile.execute({
    name: "Administrador",
    id_software: software.id,
    active: true,
  });

  profile.id = "79db678a-eb17-430c-b03a";

  await expect(getProfileById.execute(profile)).rejects.toThrow();
});
