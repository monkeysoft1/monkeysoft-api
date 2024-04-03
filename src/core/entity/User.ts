import crypto from "crypto";
import AppError from "./AppError";
import FormattedDate from "./FormattedDate";
import UserType from "./UserType";

export default class User {
  id: string = "";
  userType: UserType;
  private _name: string = "";
  private _email: string = "";
  private _phone_number: string = "";
  private _password: string = "";
  private _active: boolean = false;
  private _reset: boolean = false;
  private _token: string = "";
  expire_token: Date;
  login_tries: number = 0;

  created_on?: Date;
  updated_on?: Date;

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O nome do usuario é maior que ${maxLength} caracteres`, 400);
    }

    this._name = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`O email informado é maior que ${maxLength} caracteres`, 400);
    }

    const splitedEmail = value.split("@");
    if (splitedEmail.length < 2 || splitedEmail[0].length < 3) {
      throw new AppError(`O e-mail informado não é válido`, 400);
    }

    this._email = value;
  }

  public get phone_number(): string {
    return this._phone_number;
  }

  public set phone_number(value: string) {
    const maxLength = 13;

    if (value.length > maxLength) {
      throw new AppError(`A telefone informado é maior que ${maxLength} caracteres`, 400);
    }

    this._phone_number = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    const maxLength = 255;

    if (value.length > maxLength) {
      throw new AppError(`A senha informada é maior que ${maxLength} caracteres`, 400);
    }

    const regEx = /^[0-9a-fA-F]{32}$/;
    if (!regEx.test(value)) {
      throw new AppError(`A senha precisa estar criptografada em MD5`, 400);
    }

    this._password = value;
  }

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    this._active = Boolean(value);
  }

  public get reset(): boolean {
    return this._reset;
  }

  public set reset(value: boolean) {
    this._reset = Boolean(value);
  }

  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    const maxLength = 255;

    if (value && value.length > maxLength) {
      throw new AppError(`O token é maior que ${maxLength} caracteres`, 400);
    }

    this._token = value ?? this._token;
  }

  incrementLoginTries() {
    this.login_tries += 1;
    if (this.login_tries > 10) {
      this._active = false;
    }
  }

  constructor() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
    this.expire_token = new FormattedDate().date;
    this.userType = new UserType();
  }
}
