import { SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";

export type SearchInputProps = ComponentProps<typeof Input> & {
	placeholder?: string;
};

export function SearchInput(props: SearchInputProps) {
	const { placeholder, className, ...rest } = props;

	return (
		<div className="relative">
			<SearchIcon
				className={cn(
					"size-4 absolute left-2 top-1/2 -translate-y-1/2",
					"text-muted-foreground",
				)}
			/>
			<Input
				type="text"
				placeholder={placeholder}
				className={cn("pl-8", className)}
				{...rest}
			/>
		</div>
	);
}
