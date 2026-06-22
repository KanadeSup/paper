import { cn } from "@renderer/modules/design-system";
import Logger from "electron-log/renderer.js";
import { useChatController } from "../../hooks/use-chat-controller";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./message-list";

export type PdfChatProps = {
	documentId: string;
	className?: string;
};
export function PdfChat(props: PdfChatProps) {
	const { documentId, className } = props;

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
			<div className="rounded-md bg-sidebar p-2">
				<h2 className="text-sm font-medium"> PDF chat</h2>
			</div>
			<div className="w-full h-full bg-sidebar rounded-md">
				<ChatMessageList messages={messages} />
			</div>
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
