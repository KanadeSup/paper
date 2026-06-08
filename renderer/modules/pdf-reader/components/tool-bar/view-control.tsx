import { SpreadMode, useSpread } from "@embedpdf/plugin-spread/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	IconButton,
} from "@renderer/modules/design-system";
import { BookOpenIcon, CheckIcon, EyeIcon, FileTextIcon } from "lucide-react";

export type ViewControlProps = {
	documentId: string;
	onPopupOpen?: () => void;
	onPopupClose?: () => void;
};

export function ViewControl({
	documentId,
	onPopupOpen,
	onPopupClose,
}: ViewControlProps) {
	const { spreadMode, provides } = useSpread(documentId);

	const handleOpenChange = (open: boolean) => {
		if (open) onPopupOpen?.();
		else onPopupClose?.();
	};

	return (
		<DropdownMenu onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<IconButton variant="secondary">
					<EyeIcon />
				</IconButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" alignOffset={-5} className="w-44">
				<DropdownMenuItem
					className="cursor-pointer flex justify-between items-center"
					onSelect={() => provides?.setSpreadMode(SpreadMode.None)}
				>
					<div className="flex items-center gap-1.5">
						<FileTextIcon />
						Single Page
					</div>
					{spreadMode === SpreadMode.None && <CheckIcon className="size-4" />}
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer flex justify-between items-center"
					onSelect={() => provides?.setSpreadMode(SpreadMode.Odd)}
				>
					<div className="flex items-center gap-1.5">
						<BookOpenIcon />
						Double Page
					</div>
					{[SpreadMode.Odd, SpreadMode.Even].includes(spreadMode) && (
						<CheckIcon className="size-4" />
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
