import { CircleAlertIcon } from "lucide-react";
import { cn } from "../../lib";

export type ErrorAlertProps = {
	children: React.ReactNode;
	className?: string;
};
export function ErrorAlert({ children, className }: ErrorAlertProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 bg-accent/80 p-3 rounded-md",
				className,
			)}
		>
			{children}
		</div>
	);
}

ErrorAlert.Indicator = function Indicator() {
	return <CircleAlertIcon className="size-4 stroke-destructive" />;
};

export type ErrorAlertTitleProps = {
	children?: React.ReactNode;
	className?: string;
};
ErrorAlert.Title = function Title({
	children,
	className,
}: ErrorAlertTitleProps) {
	return (
		<div className={cn("flex items-center gap-2 text-destructive", className)}>
			{children}
		</div>
	);
};

export type ErrorAlertDescriptionProps = {
	children?: React.ReactNode;
	className?: string;
};
ErrorAlert.Description = function Description({
	children,
	className,
}: ErrorAlertDescriptionProps) {
	return <div className={cn("text-sm", className)}>{children}</div>;
};

export type ErrorAlertFooterProps = {
	children?: React.ReactNode;
	className?: string;
};
ErrorAlert.Footer = function Footer({
	children,
	className,
}: ErrorAlertFooterProps) {
	return (
		<div className={cn("flex items-center gap-2 text-destructive", className)}>
			{children}
		</div>
	);
};
