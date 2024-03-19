import PaymentMethodRepositoryMem from "../../../infra/repository/PaymentMethodRepositoryMem";
import CreatePaymentMethod from "./CreatePaymentMethod";
import GetPaymentMethodById from "./GetPaymentMethodById";

test("should be search a Payment Method by id", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const getPaymentMethodById = new GetPaymentMethodById(paymentMethodRepository);

  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);

  const paymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  const paymentMethods = await getPaymentMethodById.execute(paymentMethod);

  expect(paymentMethods).toHaveProperty(["id"]);
});

test("should be throw an error when id is empty", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const getPaymentMethodById = new GetPaymentMethodById(paymentMethodRepository);

  await expect(getPaymentMethodById.execute({ id: "" })).rejects.toThrow();
});

test("should be throw an error when result is empty", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const getPaymentMethodById = new GetPaymentMethodById(paymentMethodRepository);

  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);

  const paymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito",
  });

  paymentMethod.id = "79db678a-eb17-430c-b03a";

  await expect(getPaymentMethodById.execute(paymentMethod)).rejects.toThrow();
});
