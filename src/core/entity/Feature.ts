import crypto from "crypto";
import AppError from "./AppError";
import FormattedDate from "./FormattedDate";

export default class Feature {
  id: string = "";
  private _id_software: string = "";
  private _name: string = "";
  private _url: string = "";
  private _is_page: boolean = false;
  private _description: string = "";
  private _active: boolean = false;
  created_on?: Date;
  updated_on?: Date;

  public get id_software(): string {
    return this._id_software;
  }

  public set id_software(value: string) {
    this._id_software = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    if (!value.trim()) {
      throw new AppError("O nome da feature não pode ser vazio", 400);
    }

    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O nome da feature é maior que ${maxLength} caracteres`, 400);
    }

    this._name = value;
  }

  public get url(): string {
    return this._url;
  }

  public set url(value: string | undefined) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`A url informada é maior que ${maxLength} caracteres`, 400);
    }

    this._url = value ?? this._url;
    this._is_page = !!this._url;
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

  public get is_page(): boolean {
    return this._is_page;
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean | undefined) {
    this._active = Boolean(value ?? this._active);
  }

  create() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
