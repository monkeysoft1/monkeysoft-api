import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProfile from "./CreateProfile";

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

test("should be create a profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();

  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "user-premium",
    active: true,
  });

  expect(profile.name).toBe("user-premium");
});

test("should be throw an error when name is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await expect(
    createProfile.execute({
      id_software: software.id,
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profileData = {
    id_software: software.id,
    name: "user-premium",
    active: true,
  };
  await createProfile.execute(profileData);

  await expect(createProfile.execute(profileData)).rejects.toThrow();
});

test("should be throw an error when name to long", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profileData = {
    id_software: software.id,
    name: generateLongString(256),
    active: true,
  };

  await expect(createProfile.execute(profileData)).rejects.toThrow();
});

test("should throw an error with profile id_software is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const profile = createProfile.execute({
    id_software: "",
    name: "user-premium",
    active: true,
  });

  await expect(profile).rejects.toThrow();
});

test("should throw an error with profile id_software is undefined", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const profile = createProfile.execute({
    name: "user-premium",
    active: true,
  });

  await expect(profile).rejects.toThrow();
});

test("should throw an error when software not exists", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const profile = createProfile.execute({
    id_software: "000",
    name: "user-premium",
    active: true,
  });

  await expect(profile).rejects.toThrow();
});
