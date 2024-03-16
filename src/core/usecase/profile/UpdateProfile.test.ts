import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProfile from "./CreateProfile";
import UpdateProfile from "./UpdateProfile";

test("should be update profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const newProfile = await createProfile.execute({
    id_software: software.id,
    name: "add_user",
    active: true,
  });

  const updateSoftware = new UpdateProfile(profileRepository, softwareRepository);

  const overwritingSoftware = await updateSoftware.execute({
    id: newProfile.id,
    id_software: newProfile.id_software,
    name: "Monkey New Zap",
    active: false,
  });

  expect(overwritingSoftware.name).toBe("Monkey New Zap");
});

test("should be update partial profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "login",
  });

  const updatedProfile = await updateProfile.execute({
    id: profile.id,
    name: "Monkey Zap",
  });

  expect(updatedProfile.active).toBe(profile.active);
});

test("should be throw an error when name is equal an other profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  await createProfile.execute({
    id_software: software.id,
    name: "login",
  });

  const logoutProfile = await createProfile.execute({
    id_software: software.id,
    name: "logout",
  });

  const updatedProfile = updateProfile.execute({
    id: logoutProfile.id,
    name: "login",
  });

  await expect(updatedProfile).rejects.toThrow();
});
test("should be throw an error when id_software not exists ", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);
  const createProfile = new CreateProfile(profileRepository, softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-soft" });

  const profile = await createProfile.execute({
    id_software: software.id,
    name: "login",
  });

  const updatedProfile = updateProfile.execute({
    id: profile.id,
    id_software: "123",
  });

  await expect(updatedProfile).rejects.toThrow();
});

test("should be throw an error when id is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);

  await expect(
    updateProfile.execute({
      id: "",
      name: "Monkey Zap",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name is empty", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);

  await expect(
    updateProfile.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const updateProfile = new UpdateProfile(profileRepository, softwareRepository);

  await expect(
    updateProfile.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      name: "Monkey Zap",
      active: false,
    })
  ).rejects.toThrow();
});
