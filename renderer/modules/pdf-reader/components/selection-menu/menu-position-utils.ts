export const MENU_GAP = 8;
export const VIEWPORT_PAD = 30;

export const RESULT_MIN_WIDTH = 280;
export const RESULT_MAX_WIDTH = 420;
export const RESULT_MIN_HEIGHT = 160;
export const RESULT_MAX_HEIGHT = 320;

export type AnchorRect = {
	left: number;
	top: number;
	width: number;
	height: number;
};

export type PopupCoords = {
	x: number;
	y: number;
};

export function clampPopupPosition(
	anchor: AnchorRect,
	popupWidth: number,
	popupHeight: number,
	suggestTop: boolean,
): PopupCoords {
	let x = anchor.left + anchor.width / 2 - popupWidth / 2;
	let y = suggestTop
		? anchor.top - MENU_GAP - popupHeight
		: anchor.top + anchor.height + MENU_GAP;

	const maxX = window.innerWidth - popupWidth - VIEWPORT_PAD;
	const maxY = window.innerHeight - popupHeight - VIEWPORT_PAD;
	x = Math.min(Math.max(VIEWPORT_PAD, x), Math.max(VIEWPORT_PAD, maxX));
	y = Math.min(Math.max(VIEWPORT_PAD, y), Math.max(VIEWPORT_PAD, maxY));

	return { x, y };
}
