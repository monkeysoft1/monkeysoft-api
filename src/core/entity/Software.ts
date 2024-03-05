import crypto from "crypto";
import FormattedDate from "./FormattedDate";

export default class Software {
  id: string = "";
  name: string = "";
  description?: string = "";
  active?: boolean = false;
  created_on?: Date;

  create() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
