import {
	useIsViewportGated,
	useViewportCapability,
	useViewportRef,
	ViewportElementContext,
} from "@embedpdf/plugin-viewport/react";
import { ScrollArea, ScrollBar } from "@renderer/modules/design-system";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useEffect, useImperativeHandle, useState } from "react";

type ViewportProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode;
	documentId: string;
	ref?: Ref<HTMLDivElement>;
};

export function PDFViewport({
	children,
	documentId,
	ref,
	...props
}: ViewportProps) {
	const [viewportGap, setViewportGap] = useState(0);
	const viewportRef = useViewportRef(documentId);
	const { provides: viewportProvides } = useViewportCapability();
	const isGated = useIsViewportGated(documentId);

	useImperativeHandle(ref, () => viewportRef.current, [viewportRef]);

	useEffect(() => {
		if (viewportProvides) {
			setViewportGap(viewportProvides.getViewportGap());
		}
	}, [viewportProvides]);

	const { style, dir, ...restProps } = props;

	return (
		<ViewportElementContext.Provider value={viewportRef}>
			<ScrollArea
				{...restProps}
				ref={viewportRef}
				style={{
					width: "100%",
					height: "100%",
					overflow: "auto",
					...(typeof style === "object" ? style : {}),
					padding: `${viewportGap}px`,
				}}
			>
				{!isGated && children}
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</ViewportElementContext.Provider>
	);
}
