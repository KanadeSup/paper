import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFileBasename(fileName: string) {
	return fileName.split(".").slice(0, -1).join(".");
}
