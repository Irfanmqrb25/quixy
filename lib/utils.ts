import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateDistance = (date: Date) => {
  const distance = formatDistanceToNow(new Date(date));

  // Custom formatting for certain units
  if (distance.includes("second")) {
    return distance.replace("second", "s");
  } else if (distance.includes("minute")) {
    return distance.replace("minute", "min");
  } else if (distance.includes("hour")) {
    return distance.replace("hour", "h");
  } else if (distance.includes("day")) {
    return distance.replace("day", "d");
  } else if (distance.includes("month")) {
    return distance.replace("month", "mon");
  }

  return distance;
};
