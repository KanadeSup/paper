import { cn, IconButton, ScrollArea } from "@renderer/modules/design-system";
import Logger from "electron-log/renderer.js";
import { HistoryIcon, PlusIcon } from "lucide-react";
import { useRef } from "react";
import { useChatController } from "../../hooks/use-chat-controller";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./message-list";

export type PdfChatProps = {
	documentId: string;
	className?: string;
};
export function PdfChat(props: PdfChatProps) {
	const { documentId, className } = props;

	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const {
		session,
		messages,
		isStreamingMessage,
		sendUserMessage,
		createSession,
		startNewChat,
	} = useChatController({
		documentId: documentId,
	});

	const handleSubmit = async (message: string) => {
		let sessionId = session?.id ?? null;
		if (!sessionId) {
			sessionId = await createSession(documentId, {
				systemPromptWithPlaceholders: "",
			});
			if (!sessionId) {
				Logger.error("Error when creating chat session");
				return;
			}
		}
		await sendUserMessage(sessionId, message);
	};

	return (
		<aside
			className={cn("flex flex-col h-full w-72 shrink-0 gap-3", className)}
		>
			{/* Header */}
			<div className="rounded-md bg-sidebar px-2 h-10 flex items-center justify-between">
				<h2 className="text-sm font-medium"> PDF chat</h2>
				<div className="flex gap-2">
					<IconButton variant="outline" onClick={() => startNewChat()}>
						<HistoryIcon className="size-4" />
					</IconButton>
					<IconButton variant="outline" onClick={() => startNewChat()}>
						<PlusIcon className="size-4" />
					</IconButton>
				</div>
			</div>
			<ScrollArea
				overflowAnchor="none"
				ref={scrollContainerRef}
				className="flex-1 bg-sidebar rounded-md overflow-auto"
			>
				<ChatMessageList
					className="p-2 pr-2"
					messages={messages}
					scrollContainer={scrollContainerRef.current}
				/>
			</ScrollArea>
			<div>
				<ChatInput
					className="mt-auto"
					onSubmit={handleSubmit}
					state={isStreamingMessage ? "LOADING" : "ACTIVE"}
				/>
			</div>
		</aside>
	);
}
