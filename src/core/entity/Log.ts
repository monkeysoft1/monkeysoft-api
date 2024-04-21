import FormattedDate from "./FormattedDate";

export default class Log {
  id_table: number = 0;
  name_table: string = "";
  old_object: any = "";
  new_object: any = "";
  created_by?: string = "";
  created_on?: Date;

  constructor() {
    this.created_on = new FormattedDate().date;
  }
}
