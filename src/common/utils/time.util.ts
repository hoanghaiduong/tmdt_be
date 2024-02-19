import { Unit } from "../enum";

export class TimeUtil{

  public static convertTimeToSeconds(number: number, unit: Unit) {
    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
    const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
    const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY;
    const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;
    switch (unit) {
      case 's':
        return number;
      case 'm':
        return number * SECONDS_IN_MINUTE;
      case 'h':
        return number * SECONDS_IN_HOUR;
      case 'd':
        return number * SECONDS_IN_DAY;
      case 'w':
        return number * SECONDS_IN_WEEK;
      case 'y':
        return number * SECONDS_IN_YEAR;
      default:
        return number;
    }
  }

  public static startDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static endDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  }

}