import { Button, cn } from "@renderer/modules/design-system";
import { useState } from "react";
import { ShortcutCaptureDialog } from "./shortcut-capture-dialog";
import { ShortcutKbd } from "./shortcut-kbd";

export type KeyboardInputProps = {
	value: string[];
	onChange: (keys: string[]) => void;
	className?: string;
};

export function KeyboardInput({
	value,
	className,
	onChange,
}: KeyboardInputProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				variant="outline"
				onClick={() => setIsOpen(true)}
				className={cn(
					"h-9 min-w-28 justify-center px-2.5 font-normal",
					"hover:bg-muted/70",
					className,
				)}
			>
				<ShortcutKbd keys={value} size="sm" />
			</Button>

			<ShortcutCaptureDialog
				open={isOpen}
				initialKeys={value}
				onConfirm={(keys) => {
					setIsOpen(false);
					onChange(keys);
				}}
				onCancel={() => setIsOpen(false)}
			/>
		</>
	);
}
