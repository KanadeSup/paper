import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@renderer/modules/design-system";
import { getShortcutKeyFromEvent } from "@renderer/modules/shortcut/libs/shortcut";
import { useCallback, useEffect, useState } from "react";
import { isValidShortcutKeys } from "../utils/shortcut-keys";
import { ShortcutKbd } from "./shortcut-kbd";

export type ShortcutCaptureDialogProps = {
	open: boolean;
	initialKeys: string[];
	onConfirm: (keys: string[]) => void;
	onCancel: () => void;
};

export function ShortcutCaptureDialog({
	open,
	initialKeys,
	onConfirm,
	onCancel,
}: ShortcutCaptureDialogProps) {
	const [previewKeys, setPreviewKeys] = useState(initialKeys);

	useEffect(() => {
		if (open) {
			setPreviewKeys(initialKeys);
		}
	}, [open, initialKeys]);

	const handleKeydown = useCallback(
		(event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();

			if (event.key === "Enter") {
				if (isValidShortcutKeys(previewKeys)) {
					onConfirm(previewKeys);
				}
				return;
			}

			if (event.key === "Escape") {
				onCancel();
				return;
			}

			const shortcutKeys = getShortcutKeyFromEvent(event);
			if (!shortcutKeys) return;

			setPreviewKeys(shortcutKeys);
		},
		[previewKeys, onConfirm, onCancel],
	);

	useEffect(() => {
		if (!open) return;

		window.addEventListener("keydown", handleKeydown, true);
		return () => {
			window.removeEventListener("keydown", handleKeydown, true);
		};
	}, [open, handleKeydown]);

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) onCancel();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-sm gap-0 overflow-hidden p-0"
				onOpenAutoFocus={(event) => event.preventDefault()}
			>
				<DialogHeader className="sr-only">
					<DialogTitle>Record shortcut</DialogTitle>
					<DialogDescription>
						Press a key combination, then Enter to confirm or Escape to cancel.
					</DialogDescription>
				</DialogHeader>

				<div className="flex min-h-36 flex-col items-center justify-center gap-3 bg-muted/30 px-6 py-8">
					{previewKeys.length > 0 ? (
						<ShortcutKbd keys={previewKeys} />
					) : (
						<p className="text-sm text-muted-foreground">
							Press your keyboard…
						</p>
					)}
				</div>

				<div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
					Press Enter to confirm · Escape to cancel
				</div>
			</DialogContent>
		</Dialog>
	);
}
