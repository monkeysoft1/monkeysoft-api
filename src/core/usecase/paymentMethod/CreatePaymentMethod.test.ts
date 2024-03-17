import PaymentMethodRepositoryMem from "../../../infra/repository/PaymentMethodRepositoryMem";
import CreatePaymentMethod from "./CreatePaymentMethod";

test("should be create a Payment Method", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const paymentMethod = await createPaymentMethod.execute({
    description: "Cartão de Crédito"
  });

  expect(paymentMethod.description).toBe("Cartão de Crédito");
});

test("should be throw an error when description is empty", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);

  await expect(
    createPaymentMethod.execute({
      description: "",
    })
  ).rejects.toThrow();
});

test("should be throw an error when description exists", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const paymentMethodData = {
    description: "Cartão de Crédito",
    active: true,
  };
  await createPaymentMethod.execute(paymentMethodData);

  await expect(createPaymentMethod.execute(paymentMethodData)).rejects.toThrow();
});

test("should be throw an error when description to long", async () => {
  const paymentMethodRepository = new PaymentMethodRepositoryMem();
  const createPaymentMethod = new CreatePaymentMethod(paymentMethodRepository);
  const paymentMethodData = {
    description: generateLongString(256),
  };

  await expect(createPaymentMethod.execute(paymentMethodData)).rejects.toThrow();
});

function generateLongString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
