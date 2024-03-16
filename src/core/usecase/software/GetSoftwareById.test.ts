import SoftwareRepositoryMem from "../../../infra/repository/SoftwareRepositoryMem";
import CreateSoftware from "./CreateSoftware";
import GetSoftwareById from "./GetSoftwareById";

test("should be search a software by id", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getSoftwareById = new GetSoftwareById(softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  const softwares = await getSoftwareById.execute(software);

  expect(softwares).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getSoftwareById = new GetSoftwareById(softwareRepository);

  await expect(getSoftwareById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getSoftwareById = new GetSoftwareById(softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  software.id = "79db678a-eb17-430c-b03a";

  await expect(getSoftwareById.execute(software)).rejects.toThrow();
});
