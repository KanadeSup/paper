import { cn } from "@renderer/modules/design-system";
import { ChatInput } from "./chat-input";

export type PdfChatProps = {
	className?: string;
};
export function PdfChat(props: PdfChatProps) {
	const { className } = props;

	return (
		<aside
			className={cn("flex flex-col h-full w-72 shrink-0 gap-3", className)}
		>
			{/* Header */}
			<div className="rounded-md bg-sidebar p-2">
				<h2 className="text-sm font-medium"> PDF chat</h2>
			</div>
			<div className="w-full h-full bg-sidebar rounded-md"></div>
			<div>
				<ChatInput className="mt-auto" />
			</div>
		</aside>
	);
}
