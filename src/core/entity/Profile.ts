import crypto from "crypto";
import AppError from "../entity/AppError";
import Feature from "./Feature";
import FormattedDate from "./FormattedDate";
import Software from "./Software";

export default class Profile {
  id: string = "";
  software: Software;
  private _name: string = "";
  private _active: boolean = false;
  private _features: Feature[] = [];
  created_on?: Date;
  updated_on?: Date;

  public get features(): Feature[] {
    return this._features;
  }

  public set features(features: Feature[]) {
    this._features = features;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O nome do perfil é maior que ${maxLength} caracteres`, 400);
    }

    this._name = value;
  }

  get active(): boolean {
    return this._active;
  }

  set active(value: boolean | undefined) {
    this._active = Boolean(value ?? this._active);
  }

  constructor() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
    this.software = new Software();
  }
}
