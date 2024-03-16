import crypto from "crypto";
import AppError from "../entity/AppError";
import FormattedDate from "./FormattedDate";

export default class Profile {
  id: string = "";
  private _id_software: string = "";
  private _name: string = "";
  private _active: boolean = false;
  created_on?: Date;
  updated_on?: Date;

  public get id_software(): string {
    return this._id_software;
  }

  public set id_software(value: string) {
    this._id_software = value;
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

  create() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
