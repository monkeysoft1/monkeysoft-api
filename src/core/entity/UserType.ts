import crypto from "crypto";
import AppError from "../entity/AppError";

export default class UserType {
  id: string = "";
  private _description: string = "";

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`O nome do tipo de usuário é maior que ${maxLength} caracteres`, 400);
    }

    this._description = value ?? this._description;
  }

  constructor() {
    this.id = crypto.randomUUID();
  }
}
