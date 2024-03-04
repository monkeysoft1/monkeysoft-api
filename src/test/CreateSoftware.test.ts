import CreateSoftware from "../core/usecase/CreateSoftware";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

test("should be create a software", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
  });

  expect(software.name).toBe("Monkey Zap");
});

test("should be throw an error when name is empty", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);

  await expect(
    createSoftware.execute({
      name: "",
      active: true,
    })
  ).rejects.toThrow();
});

test("should be throw an error when name exists", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const softwareData = {
    name: "Monkey Zap",
    active: true,
  };
  await createSoftware.execute(softwareData);

  await expect(createSoftware.execute(softwareData)).rejects.toThrow();
});
