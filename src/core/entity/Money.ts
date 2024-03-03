export default class Money {
  readonly value: number;
  readonly display: string;

  constructor(value: number) {
    this.display = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
    this.value = value;
  }
}
