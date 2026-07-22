import { cn } from "../../lib/utils";

export type TagsGroupProps = {
	tags: string[];
	value: string[];
	className?: string;
	onChange: (tags: string[]) => void;
};

export function TagsGroup(props: TagsGroupProps) {
	const { tags, value, className, onChange } = props;

	if (tags.length === 0) return null;

	const activeSet = new Set(value);

	const toggleTag = (tag: string) => {
		if (activeSet.has(tag)) {
			onChange(value.filter((item) => item !== tag));
			return;
		}
		onChange([...value, tag]);
	};

	return (
		<ul
			className={cn("flex flex-wrap gap-1.5", className)}
			aria-label="Filter by tags"
		>
			{tags.map((tag) => {
				const isActive = activeSet.has(tag);

				return (
					<li key={tag}>
						<button
							type="button"
							aria-pressed={isActive}
							title={tag}
							className={cn(
								"max-w-full truncate rounded-md border px-2 py-1",
								"text-xs font-medium transition-colors",
								"border-border",
								isActive
									? "bg-primary text-primary-foreground"
									: "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
							onClick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					</li>
				);
			})}
		</ul>
	);
}
