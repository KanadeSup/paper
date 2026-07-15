import { cn, IconButton, ScrollArea } from "@renderer/modules/design-system";
import Logger from "electron-log/renderer.js";
import { HistoryIcon, MessageCircleIcon, PlusIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useChatController } from "../../hooks/use-chat-controller";
import useDefaultContext from "../../hooks/use-default-context";
import { ChatHistoryPanel } from "../chat-history/chat-history-panel";
import { ChatInput } from "../chat-input/chat-input";
import { ContextEngineSetup } from "../context-engine-setup/context-engine-setup";
import { ChatMessageList } from "../message-list/message-list";

type View = "context-setup" | "chat" | "history";

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

	const actions = useDefaultContext((state) => state.actions);
	const contextEngine = useDefaultContext((state) => state.contextEngine);

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

	const isNewChat = messages.length === 0;

	// Determine the current view
	const view: View = useMemo(() => {
		if (isHistoryView) return "history";
		if (!contextEngine && isNewChat) return "context-setup";
		return "chat";
	}, [contextEngine, isHistoryView, isNewChat]);

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
			className={cn("flex h-full min-w-0 w-full flex-col gap-3", className)}
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

			{/* Main content area */}
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

				{view === "context-setup" && (
					<div className="p-2">
						<ContextEngineSetup onConfirm={actions.setContextEngine} />
					</div>
				)}

				{view === "chat" && (
					<ChatMessageList
						contextEngine={contextEngine}
						onReselectContext={() => actions.setContextEngine(null)}
						onSuggestedPrompt={handleSubmit}
						className="p-2 pr-2"
						messages={messages}
						scrollContainer={scrollContainerRef.current}
					/>
				)}
			</ScrollArea>

			{/* Chat input */}
			{view === "chat" && (
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
