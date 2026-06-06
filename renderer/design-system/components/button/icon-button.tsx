import { cn } from "@renderer/design-system/lib/utils";
import type { ComponentProps } from "react";
import { Button } from "../ui/button";

export type IconButtonProps = ComponentProps<typeof Button> & {
	children: React.ReactNode;
	className?: string;
};

export function IconButton(props: IconButtonProps) {
	const { children, className, ...rest } = props;

	return (
		<Button {...rest} variant="ghost" size="icon" className={cn(className)}>
			{children}
		</Button>
	);
}
