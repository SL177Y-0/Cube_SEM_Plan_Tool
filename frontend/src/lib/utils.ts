import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// utility function for combining class names - learned this from shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
