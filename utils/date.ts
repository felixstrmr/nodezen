import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from "date-fns";

const DAYS_IN_WEEK = 7;
const WEEKS_IN_MONTH = 4;
const MONTHS_IN_YEAR = 12;

export function formatRelativeTime(date: Date | string): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const minutesDiff = differenceInMinutes(targetDate, now);
  const absoluteMinutes = Math.abs(minutesDiff);

  if (absoluteMinutes < 1) {
    return "now";
  }

  const isFuture = minutesDiff > 0;
  const prefix = isFuture ? "in " : "";
  const suffix = isFuture ? "" : " ago";

  if (absoluteMinutes < 60) {
    return `${prefix}${absoluteMinutes}m${suffix}`;
  }

  const hoursDiff = differenceInHours(targetDate, now);
  const absoluteHours = Math.abs(hoursDiff);
  if (absoluteHours < 24) {
    return `${prefix}${absoluteHours}h${suffix}`;
  }

  const daysDiff = differenceInDays(targetDate, now);
  const absoluteDays = Math.abs(daysDiff);
  if (absoluteDays < DAYS_IN_WEEK) {
    return `${prefix}${absoluteDays}d${suffix}`;
  }

  const weeksDiff = differenceInWeeks(targetDate, now);
  const absoluteWeeks = Math.abs(weeksDiff);
  if (absoluteWeeks < WEEKS_IN_MONTH) {
    return `${prefix}${absoluteWeeks}w${suffix}`;
  }

  const monthsDiff = differenceInMonths(targetDate, now);
  const absoluteMonths = Math.abs(monthsDiff);
  if (absoluteMonths < MONTHS_IN_YEAR) {
    return `${prefix}${absoluteMonths}mo${suffix}`;
  }

  const yearsDiff = differenceInYears(targetDate, now);
  const absoluteYears = Math.abs(yearsDiff);
  return `${prefix}${absoluteYears}y${suffix}`;
}

type TimeUnit = "ms" | "s" | "m" | "h" | "d";

export function dateDifference(
  date1: Date,
  date2: Date,
  unit: TimeUnit = "ms"
): number {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());

  const conversions = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };

  return diffInMs / conversions[unit];
}

export function signedDateDifference(
  date1: Date,
  date2: Date,
  unit: TimeUnit = "ms"
): number {
  const diffInMs = date2.getTime() - date1.getTime();

  const conversions = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };

  return diffInMs / conversions[unit];
}

export function dateDifferenceBreakdown(
  date1: Date,
  date2: Date
): Record<TimeUnit, number> {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());

  return {
    ms: diffInMs,
    s: diffInMs / 1000,
    m: diffInMs / (1000 * 60),
    h: diffInMs / (1000 * 60 * 60),
    d: diffInMs / (1000 * 60 * 60 * 24),
  };
}

export type FormattedDateDifference = {
  value: number;
  unit: TimeUnit;
  formatted: string;
};

export function formatDateDifference(
  date1: Date,
  date2: Date,
  precision = 2
): FormattedDateDifference {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  let value: number;
  let unit: TimeUnit;

  if (diffInMs < SECOND) {
    value = diffInMs;
    unit = "ms";
  } else if (diffInMs < MINUTE) {
    value = diffInMs / SECOND;
    unit = "s";
  } else if (diffInMs < HOUR) {
    value = diffInMs / MINUTE;
    unit = "m";
  } else if (diffInMs < DAY) {
    value = diffInMs / HOUR;
    unit = "h";
  } else {
    value = diffInMs / DAY;
    unit = "d";
  }

  const roundedValue = Number(value.toFixed(precision));
  const formatted = `${roundedValue}${unit}`;

  return {
    value: roundedValue,
    unit,
    formatted,
  };
}
