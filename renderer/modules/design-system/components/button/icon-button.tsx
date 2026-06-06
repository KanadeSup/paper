import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export type IconButtonProps = ComponentProps<typeof Button> & {
	children: React.ReactNode;
	className?: string;
};

export function IconButton(props: IconButtonProps) {
	const { children, className, ...rest } = props;

	return (
		<Button variant="ghost" size="icon" className={cn(className)} {...rest}>
			{children}
		</Button>
	);
}
