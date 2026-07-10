import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFileBasename(fileName: string) {
	return fileName.split(".").slice(0, -1).join(".");
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
