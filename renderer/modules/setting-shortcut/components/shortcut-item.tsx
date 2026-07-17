import { cn, IconButton } from "@renderer/modules/design-system";
import type { ShortcutDefinition } from "@shared/shortcut/types/shortcut.type";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { areShortcutKeysEqual } from "../utils/shortcut-keys";
import { KeyboardInput } from "./keyboard-input";

export type ShortcutItemProps = {
	isLoading?: boolean;
	definition: ShortcutDefinition;
	keys: string[];
	onChange: (keys: string[]) => void;
	onReset: () => void;
	onClear: () => void;
};

export function ShortcutItem({
	isLoading,
	definition,
	keys,
	onChange,
	onReset,
	onClear,
}: ShortcutItemProps) {
	const hasKeys = keys.length > 0;
	const isDefault = areShortcutKeysEqual(keys, definition.defaultKeys);

	return (
		<div
			className={cn(
				"group flex items-center gap-4 px-3 py-3",
				"transition-colors hover:bg-muted/40",
			)}
		>
			<div className="min-w-0 flex-1">
				<p className="font-medium leading-none">{definition.title}</p>
				<p className="mt-1.5 text-muted-foreground leading-relaxed">
					{definition.description}
				</p>
			</div>

			<div className="flex shrink-0 items-center gap-1">
				{!isLoading && <KeyboardInput value={keys} onChange={onChange} />}

				<div
					className={cn(
						"flex items-center",
						"opacity-0 transition-opacity duration-150",
						"group-hover:opacity-100 focus-within:opacity-100",
						(hasKeys || !isDefault) && "opacity-100",
					)}
				>
					<IconButton
						type="button"
						size="icon-sm"
						title="Reset to default"
						disabled={isDefault}
						onClick={onReset}
						className={cn(
							"text-muted-foreground hover:text-foreground",
							"disabled:opacity-30",
						)}
					>
						<RotateCcwIcon />
					</IconButton>
					<IconButton
						type="button"
						size="icon-sm"
						title="Clear shortcut"
						disabled={!hasKeys}
						onClick={onClear}
						className={cn(
							"text-muted-foreground hover:text-destructive hover:bg-destructive/10",
							"disabled:opacity-30",
						)}
					>
						<XIcon />
					</IconButton>
				</div>
			</div>
		</div>
	);
}
