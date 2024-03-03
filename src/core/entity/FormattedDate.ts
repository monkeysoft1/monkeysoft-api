export default class FormattedDate {
  readonly date: Date;
  readonly iso: string;
  readonly hours: string;

  constructor(date?: Date) {
    const ed = date ?? new Date();
    const d = ed.getDate().toString().padStart(2, "0");
    const M = (ed.getMonth() + 1).toString().padStart(2, "0");
    const y = ed.getFullYear();
    const h = ed.getHours().toString().padStart(2, "0");
    const m = ed.getMinutes().toString().padStart(2, "0");
    const s = ed.getSeconds().toString().padStart(2, "0");

    this.date = new Date(`${y}-${M}-${d}T${h}:${m}:${s}`);
    this.iso = `${y}-${M}-${d}T${h}:${m}:${s}`;
    this.hours = `${h}:${m}`;
  }
}
