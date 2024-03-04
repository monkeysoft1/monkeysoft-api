import crypto from "crypto";
import FormattedDate from "./FormattedDate";

export default class Feature {
  id: string = "";
  name: string = "";
  url?: string = "";
  is_page?: boolean = false;
  description?: string = "";
  active?: boolean = false;
  created_on?: Date;
  updated_on?: Date;

  create() {
    this.id = crypto.randomUUID();
    this.created_on = new FormattedDate().date;
  }
}
