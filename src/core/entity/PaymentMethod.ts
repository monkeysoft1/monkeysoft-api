import crypto from "crypto";
import AppError from "../entity/AppError";

export default class Software {
  id: string = "";
  private _description: string = "";

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(
        `O nome do método de pagamento é maior que ${maxLength} caracteres`,
        400
      );
    }

    this._description = value;
  }

  constructor() {
    this.id = crypto.randomUUID();
  }
}
