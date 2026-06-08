import { useZoom, ZoomMode } from "@embedpdf/plugin-zoom/react";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@renderer/modules/design-system";
import {
	ChevronDownIcon,
	GalleryHorizontal,
	GalleryVertical,
	ZoomInIcon,
	ZoomOutIcon,
} from "lucide-react";

const ZOOM_PRESETS = [
	{ label: "50%", value: 0.5 },
	{ label: "75%", value: 0.75 },
	{ label: "100%", value: 1.0 },
	{ label: "125%", value: 1.25 },
	{ label: "150%", value: 1.5 },
	{ label: "200%", value: 2.0 },
] as const;

function formatZoomLabel(currentZoom: number): string {
	return `${Math.round(currentZoom * 100)}%`;
}

export type ZoomProps = {
	documentId: string;
	onPopupOpen?: () => void;
	onPopupClose?: () => void;
};

export function Zoom(props: ZoomProps) {
	const { documentId, onPopupOpen, onPopupClose } = props;

	const { state, provides } = useZoom(documentId);

	const handleZoomIn = () => provides?.zoomIn();
	const handleZoomOut = () => provides?.zoomOut();
	const handleSelect = (value: ZoomMode | number) =>
		provides?.requestZoom(value);

	return (
		<div className="flex items-center gap-0.5">
			<Button variant="secondary" size="icon-sm" onClick={handleZoomOut}>
				<ZoomOutIcon />
			</Button>

			<ZoomDropdown
				label={formatZoomLabel(state.currentZoomLevel)}
				handleSelect={handleSelect}
				onPopupOpen={onPopupOpen}
				onPopupClose={onPopupClose}
			/>

			<Button variant="secondary" size="icon-sm" onClick={handleZoomIn}>
				<ZoomInIcon />
			</Button>
		</div>
	);
}

type ZoomDropdownProps = {
	label: string;
	handleSelect: (value: ZoomMode | number) => void;
	onPopupOpen?: () => void;
	onPopupClose?: () => void;
};
function ZoomDropdown(props: ZoomDropdownProps) {
	const { label, handleSelect, onPopupOpen, onPopupClose } = props;

	const handleOpenChange = (open: boolean) => {
		if (open) onPopupOpen?.();
		else onPopupClose?.();
	};

	return (
		<DropdownMenu onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button variant="secondary" className="w-24 justify-between">
					{label}
					<ChevronDownIcon className="size-3 opacity-60" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-36">
				{ZOOM_PRESETS.map((preset) => (
					<DropdownMenuItem
						className="cursor-pointer"
						key={preset.label}
						onSelect={() => handleSelect(preset.value)}
					>
						{preset.label}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex justify-between cursor-pointer"
					onSelect={() => handleSelect(ZoomMode.FitWidth)}
				>
					Fit to Width <GalleryVertical />
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex justify-between"
					onSelect={() => handleSelect(ZoomMode.FitPage)}
				>
					Fit to Height <GalleryHorizontal />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
