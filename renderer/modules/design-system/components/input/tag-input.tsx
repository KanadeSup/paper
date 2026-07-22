import { XIcon } from "lucide-react";
import {
	type KeyboardEvent,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";

export type TagInputProps = {
	value: string[];
	suggestions?: string[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	onChange: (tags: string[]) => void;
};

export function TagInput(props: TagInputProps) {
	const {
		value,
		suggestions = [],
		placeholder = "Add a tag…",
		className,
		disabled,
		onChange,
	} = props;

	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [anchorWidth, setAnchorWidth] = useState<number>();
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);

	const selectedSet = useMemo(
		() => new Set(value.map((tag) => tag.toLowerCase())),
		[value],
	);

	const trimmedQuery = query.trim();

	const filteredSuggestions = useMemo(() => {
		const normalizedQuery = trimmedQuery.toLowerCase();

		return suggestions.filter((suggestion) => {
			if (selectedSet.has(suggestion.toLowerCase())) return false;
			if (!normalizedQuery) return true;
			return suggestion.toLowerCase().includes(normalizedQuery);
		});
	}, [suggestions, selectedSet, trimmedQuery]);

	const canCreateTag =
		trimmedQuery.length > 0 &&
		!selectedSet.has(trimmedQuery.toLowerCase()) &&
		filteredSuggestions.length === 0;

	useLayoutEffect(() => {
		if (!open || !anchorRef.current) return;
		setAnchorWidth(anchorRef.current.offsetWidth);
	}, [open]);

	const addTag = (tag: string) => {
		const trimmed = tag.trim();
		if (!trimmed) return;
		if (selectedSet.has(trimmed.toLowerCase())) {
			setQuery("");
			return;
		}

		onChange([...value, trimmed]);
		setQuery("");
		inputRef.current?.focus();
	};

	const removeTag = (tag: string) => {
		onChange(value.filter((item) => item !== tag));
		inputRef.current?.focus();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			addTag(query);
			return;
		}

		if (event.key === "Backspace" && query.length === 0 && value.length > 0) {
			event.preventDefault();
			removeTag(value[value.length - 1]);
			return;
		}

		if (event.key === "Escape") {
			setOpen(false);
		}
	};

	return (
		<Popover open={open}>
			<PopoverAnchor asChild>
				<div
					ref={anchorRef}
					className={cn(
						"flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input",
						"bg-transparent px-2 py-1 transition-colors",
						"focus-within:border-ring dark:bg-input/30",
						disabled && "pointer-events-none cursor-not-allowed opacity-50",
						className,
					)}
					onClick={() => {
						if (disabled) return;
						inputRef.current?.focus();
					}}
				>
					{value.map((tag) => (
						<span
							key={tag}
							className={cn(
								"inline-flex max-w-full items-center gap-1 rounded-md",
								"bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground",
							)}
							onMouseDown={(event) => {
								event.preventDefault();
							}}
						>
							<span className="truncate">{tag}</span>
							<button
								type="button"
								className={cn(
									"shrink-0 rounded-sm text-muted-foreground",
									"hover:text-foreground transition-colors",
								)}
								onClick={(event) => {
									event.stopPropagation();
									removeTag(tag);
								}}
							>
								<XIcon className="size-3" />
							</button>
						</span>
					))}

					<input
						ref={inputRef}
						type="text"
						value={query}
						disabled={disabled}
						placeholder={value.length === 0 ? placeholder : undefined}
						className={cn(
							"min-w-24 flex-1 bg-transparent text-sm outline-none",
							"placeholder:text-muted-foreground",
						)}
						onChange={(event) => {
							setQuery(event.target.value);
						}}
						onFocus={() => setOpen(true)}
						onBlur={() => setOpen(false)}
						onKeyDown={handleKeyDown}
					/>
				</div>
			</PopoverAnchor>

			<PopoverContent
				align="start"
				sideOffset={4}
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="gap-0 p-1"
				style={anchorWidth ? { width: anchorWidth } : undefined}
			>
				{filteredSuggestions.length > 0 ? (
					<ul className="flex max-h-48 flex-col overflow-auto">
						{filteredSuggestions.map((suggestion) => (
							<li key={suggestion}>
								<button
									type="button"
									className={cn(
										"flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm",
										"hover:bg-muted transition-colors",
									)}
									onMouseDown={(event) => event.preventDefault()}
									onClick={() => addTag(suggestion)}
								>
									{suggestion}
								</button>
							</li>
						))}
					</ul>
				) : canCreateTag ? (
					<button
						type="button"
						className={cn(
							"w-full rounded-md px-2 py-1.5 text-sm text-left",
							"hover:bg-muted transition-colors",
							"break-all",
						)}
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => addTag(trimmedQuery)}
					>
						create "{trimmedQuery}" tag
					</button>
				) : (
					<p className="px-2 py-1.5 text-xs text-muted-foreground">
						enter the name tag and press enter to create new tag
					</p>
				)}
			</PopoverContent>
		</Popover>
	);
}
