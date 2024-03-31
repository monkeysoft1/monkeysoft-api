import crypto from "crypto";
import AppError from "../entity/AppError";
import Feature from "./Feature";
import FormattedDate from "./FormattedDate";
import Product from "./Product";
import Profile from "./Profile";

export default class Software {
  id: string = "";
  private _name: string = "";
  private _description: string = "";
  private _active: boolean = false;
  created_on?: Date;

  private _features: Feature[] = [];
  private _profiles: Profile[] = [];
  private _product: Product[] = [];

  public get features(): Feature[] {
    return this._features;
  }

  public set features(features: Feature[]) {
    this._features = features;
  }

  public get profiles(): Profile[] {
    return this._profiles;
  }

  public set profiles(profiles: Profile[]) {
    this._profiles = profiles;
  }

  public get products(): Product[] {
    return this._product;
  }

  public set products(products: Product[]) {
    this._product = products;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O nome do software é maior que ${maxLength} caracteres`, 400);
    }

    this._name = value;
  }

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

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean | undefined) {
    this._active = Boolean(value ?? this._active);
  }

  create() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
