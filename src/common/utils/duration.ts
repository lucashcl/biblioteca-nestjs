export class Duration {
  private _milliseconds: number;
  private constructor(milliseconds: number) {
    this._milliseconds = milliseconds;
  }
  static fromSeconds(seconds: number) {
    return new Duration(seconds * 1000);
  }
  static fromMinutes(minutes: number) {
    return new Duration(minutes * 60 * 1000);
  }
  static fromHours(hours: number) {
    return new Duration(hours * 60 * 60 * 1000);
  }
  static fromDays(days: number) {
    return new Duration(days * 24 * 60 * 60 * 1000);
  }

  get milliseconds() {
    return this._milliseconds;
  }

  toDateFrom(date: Date) {
    return new Date(date.getTime() + this._milliseconds);
  }
}
