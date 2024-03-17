import crypto from "crypto";
import AppError from "../entity/AppError";
import FormattedDate from "./FormattedDate";

export default class Gateway {
  id: string = "";
  private _description: string = "";
  private _payment_gateway_key: string = "";
  created_on?: Date;

  get description(): string {
    return this._description;
  }

  set description(value: string | undefined) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`A descrição informada é maior que ${maxLength} caracteres`, 400);
    }
    this._description = value ?? this._description;
  }
  
  get payment_gateway_key(): string {
    return this._payment_gateway_key;
  }

  set payment_gateway_key(value: string | undefined) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`A chave do gateway é maior que ${maxLength} caracteres`, 400);
    }

    this._payment_gateway_key = value ?? this._payment_gateway_key;
  }

  constructor() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
