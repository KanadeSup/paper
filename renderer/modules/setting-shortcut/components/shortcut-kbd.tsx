import { cn } from "@renderer/modules/design-system";
import { formatShortcutKeyLabel } from "../utils/shortcut-keys";

export type ShortcutKbdProps = {
	keys: string[];
	className?: string;
	size?: "sm" | "md";
};

export function ShortcutKbd({
	keys,
	className,
	size = "md",
}: ShortcutKbdProps) {
	if (keys.length === 0) {
		return (
			<span
				className={cn(
					"text-sm text-muted-foreground",
					size === "sm" && "text-xs",
					className,
				)}
			>
				Not set
			</span>
		);
	}

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1",
				size === "sm" && "gap-0.5",
				className,
			)}
		>
			{keys.map((key, index) => (
				<span key={`${key}`} className="inline-flex items-center gap-1">
					{index > 0 && (
						<span className="text-muted-foreground/70 font-medium">+</span>
					)}
					<kbd
						className={cn(
							"inline-flex items-center justify-center rounded-md border border-border",
							"bg-muted/60 font-medium text-foreground shadow-xs",
							"min-w-6 px-1.5 py-1 leading-none text-[11px]",
							size === "md" && "min-w-7 px-2 py-1 text-xs",
						)}
					>
						{formatShortcutKeyLabel(key)}
					</kbd>
				</span>
			))}
		</span>
	);
}
