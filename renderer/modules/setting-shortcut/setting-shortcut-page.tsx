import { ScrollArea } from "@renderer/modules/design-system";
import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";
import { ShortcutConflictDialog } from "./components/shortcut-conflict-dialog";
import { ShortcutGroup } from "./components/shortcut-group";
import { useShortcutSettings } from "./hooks/use-shortcut-settings";

export function SettingShortcutPage() {
	const {
		groupedShortcuts,
		pendingChange,
		requestChange,
		resetShortcut,
		clearShortcut,
		cancelPendingChange,
		confirmOverride,
	} = useShortcutSettings();

	return (
		<SettingLayout>
			<div className="flex flex-col gap-1">
				<SettingTitle title="Shortcuts" />
				<p className="text-sm text-muted-foreground">
					Customize keyboard shortcuts for each part of the app. Changes are
					saved as soon as you confirm a new key.
				</p>
			</div>

			<ScrollArea className="h-full">
				<div className="flex flex-col gap-6 pr-1 pb-4">
					{groupedShortcuts.map(({ group, shortcuts }) => (
						<ShortcutGroup
							key={group.id}
							group={group}
							shortcuts={shortcuts}
							onChange={requestChange}
							onReset={resetShortcut}
							onClear={clearShortcut}
						/>
					))}
				</div>
			</ScrollArea>

			<ShortcutConflictDialog
				open={pendingChange !== null}
				conflictTitle={pendingChange?.conflict.title ?? ""}
				conflictKeys={pendingChange?.conflict.keys ?? []}
				onCancel={cancelPendingChange}
				onOverride={confirmOverride}
			/>
		</SettingLayout>
	);
}
