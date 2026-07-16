import { cn } from "@renderer/modules/design-system";
import type {
	ShortcutDefinition,
	ShortcutGroupMeta,
} from "@shared/shortcut/types/shortcut.type";
import { ShortcutItem } from "./shortcut-item";

export type ShortcutGroupProps = {
	group: ShortcutGroupMeta;
	shortcuts: Array<{
		definition: ShortcutDefinition;
		keys: string[];
	}>;
	onChange: (shortcutId: ShortcutDefinition["id"], keys: string[]) => void;
	onReset: (shortcutId: ShortcutDefinition["id"]) => void;
	onClear: (shortcutId: ShortcutDefinition["id"]) => void;
};

export function ShortcutGroup({
	group,
	shortcuts,
	onChange,
	onReset,
	onClear,
}: ShortcutGroupProps) {
	if (shortcuts.length === 0) return null;

	return (
		<section className="flex flex-col gap-2">
			<div className="px-1">
				<h2 className="text-sm font-medium">{group.label}</h2>
				<p className="mt-0.5 text-sm text-muted-foreground">
					{group.description}
				</p>
			</div>

			<div
				className={cn(
					"overflow-hidden rounded-lg border border-border bg-card",
					"divide-y divide-border",
				)}
			>
				{shortcuts.map(({ definition, keys }) => (
					<ShortcutItem
						key={definition.id}
						definition={definition}
						keys={keys}
						onChange={(nextKeys) => onChange(definition.id, nextKeys)}
						onReset={() => onReset(definition.id)}
						onClear={() => onClear(definition.id)}
					/>
				))}
			</div>
		</section>
	);
}
