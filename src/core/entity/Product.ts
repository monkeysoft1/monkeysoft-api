import crypto from "crypto";
import AppError from "./AppError";
import FormattedDate from "./FormattedDate";
import Gateway from "./Gateway";
import Software from "./Software";

export default class Product {
  id: string = "";
  software: Software;
  private _name: string = "";
  private _description: string = "";
  private _price: number = 0;
  private _gateways: Gateway[] = [];
  private _active: boolean = false;

  created_on?: Date;
  updated_on?: Date;

  public get gateways(): Gateway[] {
    return this._gateways;
  }

  public set gateways(gateways: Gateway[]) {
    this._gateways = gateways;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O nome do produto é maior que ${maxLength} caracteres`, 400);
    }

    this._name = value;
  }

  public get price(): number {
    return this._price;
  }

  public set price(value: number | undefined) {
    if (value && value < 0) {
      throw new AppError(`O preço não pode ser menor que zero`, 400);
    }

    this._price = value ?? this._price;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string | undefined) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`A descrição informada é maior que ${maxLength} caracteres`, 400);
    }

    this._description = value ?? this._description;
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean | undefined) {
    this._active = Boolean(value ?? this._active);
  }

  constructor() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
    this.software = new Software();
  }
}
