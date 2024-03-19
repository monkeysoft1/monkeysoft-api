import PaymentMethodRepositoryMem from "../../../infra/repository/PaymentMethodRepositoryMem";
import CreatePaymentMethod from "./CreatePaymentMethod";
import GetAllPaymentMethods from "./GetAllPaymentMethods";

test("should be create a feature", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const getAllPaymentMethods = new GetAllPaymentMethods(paymentMethodRepository);

  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);

  await createPaymentMethod.execute({
    description: "API de mensagens",
  });

  const paymentMethods = await getAllPaymentMethods.execute({});

  expect(paymentMethods).toHaveProperty(["list"]);
  expect(paymentMethods).toHaveProperty(["total"]);
  expect(paymentMethods).toHaveProperty(["total_page"]);
});
