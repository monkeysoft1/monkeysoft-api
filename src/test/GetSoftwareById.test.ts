import CreateSoftware from "../core/usecase/CreateSoftware";
import GetSoftwareById from "../core/usecase/GetSoftwareById";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

test("should be search a software by id", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getAllSoftwares = new GetSoftwareById(softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  const softwares = await getAllSoftwares.execute(software);

  expect(softwares).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getAllSoftwares = new GetSoftwareById(softwareRepository);

  await expect(getAllSoftwares.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getAllSoftwares = new GetSoftwareById(softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);

  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  software.id = "79db678a-eb17-430c-b03a";
  
  await expect(getAllSoftwares.execute(software)).rejects.toThrow();
});
