import AppError from "../entity/AppError";
import FormattedDate from "./FormattedDate";

export default class Log {
  id_table: number = 0;
  private _name_table: string = "";
  private _old_object: any = "";
  private _new_object: any = "";
  private _created_by?: string = "";
  created_on?: Date;

  get new_object(): string {
    return this._new_object;
  }

  set new_object(value: string) {
    const maxLength = 500;

    if (value.length > maxLength) {
      throw new AppError(`O novo valor é maior que ${maxLength} caracteres`, 400);
    }

    this._new_object = value;
  }

  get old_object(): string {
    return this._old_object;
  }

  set old_object(value: string) {
    const maxLength = 500;

    if (value.length > maxLength) {
      throw new AppError(`O valor antigo é maior que ${maxLength} caracteres`, 400);
    }

    this._old_object = value;
  }

  get name_table(): string {
    return this._name_table;
  }

  set name_table(value: string) {
    const maxLength = 200;

    if (value.length > maxLength) {
      throw new AppError(`O nome da coluna é maior que ${maxLength} caracteres`, 400);
    }

    this._name_table = value;
  }

  get created_by(): string | undefined {
    return this._created_by;
  }

  set created_by(value: string) {
    const maxLength = 200;

    if (value.length > maxLength) {
      throw new AppError(`O nome do autor é maior que ${maxLength} caracteres`, 400);
    }

    this._created_by = value;
  }

  constructor() {
    this.created_on = new FormattedDate().date;
  }
}
