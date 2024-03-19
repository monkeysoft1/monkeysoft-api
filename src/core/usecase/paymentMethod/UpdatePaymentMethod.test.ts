import PaymentMethodRepositoryMem from "../../../infra/repository/PaymentMethodRepositoryMem";
import CreatePaymentMethod from "./CreatePaymentMethod";
import UpdatePaymentMethod from "./UpdatePaymentMethod";

test("should be update Payment Method", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const newPaymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);

  const overwritingPaymentMethod = await updatePaymentMethod.execute({
    id: newPaymentMethod.id,
    description: "Cartão de Débito",
  });

  expect(overwritingPaymentMethod.description).toBe("Cartão de Débito");
});

test("should be throw an error when id is empty", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);

  await expect(
    createPaymentMethod.execute({
      id: "",
      description: "Cartão de Crédito",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description is empty", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);

  await expect(
    createPaymentMethod.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "",
    })
  ).rejects.toThrow();
});

test("should be throw an error when id not exist", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);

  await expect(
    updatePaymentMethod.execute({
      id: "4b48b960-37c5-4337-9c6d-bb0ffcfc6369",
      description: "Cartão de Crédito",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists in other Payment Method", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  const newPaymentMethod = await createPaymentMethod.execute({
    description: "Monkey Tree",
  });

  const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);
  await expect(
    updatePaymentMethod.execute({
      id: newPaymentMethod.id,
      description: "Cartão de Crédito",
    })
  ).rejects.toThrow();
});

test("should be throw an error when has no changes", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const paymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);
  const updatedPaymentMethod = updatePaymentMethod.execute({
    id: paymentMethod.id,
    description: "Cartão de Crédito",
  });

  await expect(updatedPaymentMethod).rejects.toThrow();
});

test("should be throw an error when description is invalid", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const paymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  const updatePaymentMethod = new UpdatePaymentMethod(paymentMethodRepository);

  const input = {
    id: paymentMethod.id,
    description: [],
  } as any;

  const updatedPaymentMethod = updatePaymentMethod.execute(input);

  await expect(updatedPaymentMethod).rejects.toThrow();
});
