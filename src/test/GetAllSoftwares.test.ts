import CreateSoftware from "../core/usecase/CreateSoftware";
import GetAllSoftwares from "../core/usecase/GetAllSoftwares";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

test("should be create a feature", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const getAllSoftwares = new GetAllSoftwares(softwareRepository);

  const createSoftware = new CreateSoftware(softwareRepository);

  await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "API de mensagens",
  });

  const softwares = await getAllSoftwares.execute({});

  expect(softwares).toHaveProperty(["list"]);
  expect(softwares).toHaveProperty(["total"]);
  expect(softwares).toHaveProperty(["total_page"]);
});
