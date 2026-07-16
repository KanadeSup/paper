import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@renderer/modules/design-system";
import { ShortcutKbd } from "./shortcut-kbd";

export type ShortcutConflictDialogProps = {
	open: boolean;
	conflictTitle: string;
	conflictKeys: string[];
	onCancel: () => void;
	onOverride: () => void;
};

export function ShortcutConflictDialog({
	open,
	conflictTitle,
	conflictKeys,
	onCancel,
	onOverride,
}: ShortcutConflictDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) onCancel();
			}}
		>
			<DialogContent showCloseButton={false} className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Shortcut already in use</DialogTitle>
					<DialogDescription asChild>
						<div className="space-y-3">
							<p>
								This key combination is already assigned to{" "}
								<span className="font-medium text-foreground">
									{conflictTitle}
								</span>
								.
							</p>
							<div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
								<ShortcutKbd keys={conflictKeys} size="sm" />
								<span className="text-xs text-muted-foreground truncate">
									{conflictTitle}
								</span>
							</div>
							<p>Override it to use this shortcut instead?</p>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button onClick={onOverride}>Override</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
