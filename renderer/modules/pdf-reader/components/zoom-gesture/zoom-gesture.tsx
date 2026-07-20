import { useZoomGesture } from "../../hooks/use-zoom-gesture";

export type ZoomProps = {
	documentId: string;
	children: React.ReactNode;
};

export function Zoom(props: ZoomProps) {
	const { documentId, children } = props;
	const { elementRef } = useZoomGesture(documentId);

	return (
		<div
			ref={elementRef}
			style={{
				display: "inline-block",
				overflow: "visible",
				boxSizing: "border-box",
			}}
		>
			{children}
		</div>
	);
}
