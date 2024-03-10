import CreateSoftware from '../core/usecase/CreateSoftware';
import UpdateSoftware from '../core/usecase/UpdateSoftware';
import SoftwareRepositoryMem from '../infra/repository/SoftwareRepositoryMem';

test('should be update software', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const newSoftware = await createSoftware.execute({
    name: 'Monkey Zap',
    active: true,
    description: 'Serviço de whats',
  });

  const updateSofware = new UpdateSoftware(softwareRepository);

  const overwritingSofware = await updateSofware.execute({
    id: newSoftware.id,
    name: 'Monkey New Zap',
    active: false,
    description: 'Serviço de whats',
  });

  expect(overwritingSofware.name).toBe('Monkey New Zap');
});

test('should be throw an error when id is empty', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new UpdateSoftware(softwareRepository);

  await expect(
    createSoftware.execute({
      id: '',
      name: 'Monkey Zap',
      active: true,
    })
  ).rejects.toThrow();
});

test('teste', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const updateSoftware = new UpdateSoftware(softwareRepository);

  await expect(
    updateSoftware.execute({
      id: '4b48b960-37c5-4337-9c6d-bb0ffcfc6369',
      name: '',
      active: true,
    })
  ).rejects.toThrow();
});

test('should be throw an error when name is empty', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new UpdateSoftware(softwareRepository);

  await expect(
    createSoftware.execute({
      id: '4b48b960-37c5-4337-9c6d-bb0ffcfc6369',
      name: '',
      active: true,
    })
  ).rejects.toThrow();
});

test('should be throw an error when id not exist', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const updateSofware = new UpdateSoftware(softwareRepository);

  await expect(
    updateSofware.execute({
      id: '4b48b960-37c5-4337-9c6d-bb0ffcfc6369',
      name: 'Monkey Zap',
      active: false,
      description: 'Serviço de whats',
    })
  ).rejects.toThrow();
});

test('should be throw an error when name exists in other software', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  await createSoftware.execute({
    name: 'Monkey Zap',
    active: true,
    description: 'Serviço de whats',
  });

  var newSoftware = await createSoftware.execute({
    name: 'Monkey Tree',
    active: true,
    description: 'Serviço de whats',
  });

  const updateSofware = new UpdateSoftware(softwareRepository);
  await expect(
    updateSofware.execute({
      id: newSoftware.id,
      name: 'Monkey Zap',
      active: false,
      description: 'Serviço de whats',
    })
  ).rejects.toThrow();
});
test('should be throw an error when has no changes', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({
    name: 'Monkey Zap',
    active: true,
    description: 'Serviço de whats',
  });

  const updateSofware = new UpdateSoftware(softwareRepository);
  const updatedSoftware = updateSofware.execute({
    id: software.id,
    name: 'Monkey Zap',
  });

  await expect(updatedSoftware).rejects.toThrow();
});
test('should be throw an error when name is empty', async () => {
  const softwareRepository = new SoftwareRepositoryMem();
  const createSoftware = new CreateSoftware(softwareRepository);
  const software = await createSoftware.execute({
    name: 'Monkey Zap',
    active: true,
    description: 'Serviço de whats',
  });

  const updateSofware = new UpdateSoftware(softwareRepository);

  const input = {
    id: software.id,
    name: [],
  } as any;

  const updatedSoftware = updateSofware.execute(input);

  await expect(updatedSoftware).rejects.toThrow();
});
