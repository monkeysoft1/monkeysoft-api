import crypto from "crypto";
import FormattedDate from "./FormattedDate";

export default class Session {
  token: string = "";
  expire_token: Date;
  timeout: number;

  constructor(private readonly time: number) {
    this.expire_token = new Date();
    this.timeout = time * 60;
    this.create();
  }

  create() {
    const currentDate = new Date();
    const expiredDate = new FormattedDate(
      new Date(currentDate.setMinutes(currentDate.getMinutes() + this.time))
    ).date;

    this.expire_token = new FormattedDate(expiredDate).date;
    this.token = crypto.randomUUID();
  }
}
