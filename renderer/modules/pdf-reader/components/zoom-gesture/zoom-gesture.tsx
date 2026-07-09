import { useZoomGesture } from "../../hooks/use-zoom-gesture";

export type ZoomGestureProps = {
	documentId: string;
	children: React.ReactNode;
};

export function ZoomGesture(props: ZoomGestureProps) {
	const { documentId, children } = props;
	const { elementRef } = useZoomGesture(documentId);

	return (
		<div className="">
			<div ref={elementRef}>{children}</div>
		</div>
	);
}
