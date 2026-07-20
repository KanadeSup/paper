import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getFileBasename(fileName: string) {
	return fileName.split(".").slice(0, -1).join(".");
}

export function formatFileSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes < 0) return "—";
	if (bytes === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB", "TB"] as const;
	const exponent = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	const value = bytes / 1024 ** exponent;
	const formatted =
		exponent === 0 || value >= 10
			? String(Math.round(value))
			: value.toFixed(1);

	return `${formatted} ${units[exponent]}`;
}

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
