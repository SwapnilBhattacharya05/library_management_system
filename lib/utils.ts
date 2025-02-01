import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    // MAP EACH WORD AND GET ONLY THE FIRST WORD
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    // GET THE FIRST 2 CHARACTERS
    .slice(0, 2);
