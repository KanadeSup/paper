import { Button } from "@renderer/modules/design-system";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useOutlines } from "../../hooks/use-outline-load";
import { usePdfReaderStore } from "../../provider/pdf-reader-provider";

type ReaderLoaderProps = {
	documentId: string;
	children: React.ReactNode;
};

export function ReaderLoader({ documentId, children }: ReaderLoaderProps) {
	const {
		outline,
		error,
		isLoading: isOutlineLoading,
	} = useOutlines(documentId);
	const [isFinished, setIsFinished] = useState(false);

	const readerActions = usePdfReaderStore((state) => state.actions);

	useEffect(() => {
		if (isOutlineLoading) return;

		if (outline) {
			readerActions.setOutline(outline);
		}
		setIsFinished(true);
	}, [outline, isOutlineLoading, readerActions]);

	if (!isFinished) return null;
	if (error) return <LoadError error={error} />;

	return children;
}

type LoadErrorProps = {
	error: string;
};
function LoadError({ error }: LoadErrorProps) {
	const router = useRouter();
	return (
		<div className="w-full h-full flex flex-col gap-2 items-center justify-center text-destructive">
			{error}
			<Button
				variant="default"
				onClick={() => {
					router.navigate({ to: "/" });
				}}
			>
				Go back
			</Button>
		</div>
	);
}
