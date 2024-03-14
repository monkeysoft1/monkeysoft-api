import ProfileRepositoryMem from "../../../infra/repository/ProfileRepositoryMem";
import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "../software/CreateSoftware";
import CreateProfile from "./CreateProfile";
import GetAllProfiles from "./GetAllProfiles";

test("should be create a profile", async () => {
  const profileRepository = new ProfileRepositoryMem();
  const softwareRepository = new SoftwareRepositoryMem();
  const createProfile = new CreateProfile(profileRepository, softwareRepository);
  const getAllProfiles = new GetAllProfiles(profileRepository);

  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({ name: "monkey-zap" });

  await createProfile.execute({
    id_software: software.id,
    name: "administrador",
    active: true,
  });

  const profiles = await getAllProfiles.execute({});

  expect(profiles).toHaveProperty(["list"]);
  expect(profiles).toHaveProperty(["total"]);
  expect(profiles).toHaveProperty(["total_page"]);
});
