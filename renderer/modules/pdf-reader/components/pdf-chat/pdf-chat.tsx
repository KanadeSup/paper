import { cn, IconButton, ScrollArea } from "@renderer/modules/design-system";
import Logger from "electron-log/renderer.js";
import { HistoryIcon, MessageCircleIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useChatController } from "../../hooks/use-chat-controller";
import { ChatHistoryPanel } from "./chat-history-panel";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./message-list";

export type PdfChatProps = {
	documentId: string;
	className?: string;
};
export function PdfChat(props: PdfChatProps) {
	const { documentId, className } = props;

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [isHistoryView, setIsHistoryView] = useState(false);
	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
		null,
	);

	const {
		session,
		messages,
		isStreamingMessage,
		sendUserMessage,
		createSession,
		startNewChat,
		setMessages,
		setSession,
	} = useChatController({
		documentId: documentId,
		sessionId: selectedSessionId ?? undefined,
	});

	const handleSubmit = async (message: string) => {
		let sessionId = session?.id ?? null;
		if (!sessionId) {
			sessionId = await createSession(documentId, {
				systemPromptWithPlaceholders:
					"You are a helpful assistant that answers questions about PDF documents. Use the provided document context to answer accurately. If the context does not contain enough information, say so clearly.",
			});
			if (!sessionId) {
				Logger.error("Error when creating chat session");
				return;
			}
		}
		await sendUserMessage(sessionId, message);
	};

	const handleSelectHistorySession = (sessionId: string) => {
		setSelectedSessionId(sessionId);
		setIsHistoryView(false);
	};

	const handleStartNewChat = async () => {
		setSelectedSessionId(null);
		await startNewChat();
		setIsHistoryView(false);
	};

	const onDeleteHistorySession = (deletedSessionId: string) => {
		if (selectedSessionId !== deletedSessionId) return;
		setSelectedSessionId(null);
		setSession(null);
		setMessages([]);
	};

	return (
		<aside
			className={cn("flex flex-col h-full w-72 shrink-0 gap-3", className)}
		>
			{/* Header */}
			<div className="rounded-md bg-sidebar px-2 h-10 flex items-center justify-between">
				<h2 className="text-sm font-medium">
					{isHistoryView ? "Chat history" : "PDF chat"}
				</h2>
				<div className="flex items-center gap-2">
					<IconButton
						variant="outline"
						onClick={() => setIsHistoryView(!isHistoryView)}
					>
						{isHistoryView && <MessageCircleIcon className="size-4" />}
						{!isHistoryView && <HistoryIcon className="size-4" />}
					</IconButton>
					<IconButton variant="outline" onClick={() => handleStartNewChat()}>
						<PlusIcon className="size-4" />
					</IconButton>
				</div>
			</div>

			{/* Chat history or chat messages */}
			<ScrollArea
				overflowAnchor="none"
				ref={scrollContainerRef}
				className="flex-1 bg-sidebar rounded-md overflow-auto"
			>
				{isHistoryView && (
					<ChatHistoryPanel
						documentId={documentId}
						currentSessionId={session?.id ?? null}
						onSelectSession={handleSelectHistorySession}
						onDeleteSession={onDeleteHistorySession}
					/>
				)}
				{!isHistoryView && (
					<ChatMessageList
						className="p-2 pr-2"
						messages={messages}
						scrollContainer={scrollContainerRef.current}
					/>
				)}
			</ScrollArea>

			{/* Chat input */}
			{!isHistoryView && (
				<div>
					<ChatInput
						className="mt-auto"
						onSubmit={handleSubmit}
						state={isStreamingMessage ? "LOADING" : "ACTIVE"}
					/>
				</div>
			)}
		</aside>
	);
}
