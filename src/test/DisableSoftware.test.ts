import CreateSoftware from "../core/usecase/CreateSoftware";
import DisableSoftware from "../core/usecase/DisableSoftware";
import SoftwareRepositoryMem from "../infra/repository/SoftwareRepositoryMem";

test("should be deactive software", async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const newSoftware = await createSoftware.execute({
    name: "Monkey Zap",
    active: true,
    description: "Serviço de whats",
  });

  const disableSofware = new DisableSoftware(softwareRepository);

  const overwritingSofware = await disableSofware.execute({
    id: newSoftware.id
  });

  expect(overwritingSofware.active).toBe(false);
});


test("should be throw an error when id is empty", async () => {
    const softwareRepository = new SoftwareRepositoryMem();
    const disableSofware = new DisableSoftware(softwareRepository);
  
    await expect(
        disableSofware.execute({
        id: "",
      })).rejects.toThrow();
});
  

test("should be throw an error when id not exists", async () => {
    const softwareRepository = new SoftwareRepositoryMem();
    const disableSofware = new DisableSoftware(softwareRepository);
  
    await expect(
        disableSofware.execute({
        id: "b6d0cc2d-17a6-4f47-9ba3-557a680b6390",
      })).rejects.toThrow();
});