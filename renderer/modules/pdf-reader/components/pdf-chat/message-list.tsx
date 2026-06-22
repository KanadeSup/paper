import { cn } from "@renderer/modules/design-system";
import { MarkdownRenderer } from "@renderer/modules/design-system/components/markdown/markdown-renderer";
import { GhostIcon, Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	DisplayedAssistantChatMessage,
	DisplayedChatMessage,
	DisplayedUserChatMessage,
} from "../../types/chat.type";

type ChatMessageListProps = {
	messages: DisplayedChatMessage[];
	askAIText?: string | null;
	className?: string;
};

export function ChatMessageList(props: ChatMessageListProps) {
	const messageListRef = useRef<HTMLDivElement>(null);

	const lastMessage =
		props.messages.length > 0
			? props.messages[props.messages.length - 1]
			: null;
	const useMinHeightWrapper = lastMessage && lastMessage.role === "assistant";
	const isLastMessageStreaming =
		lastMessage && lastMessage.role === "assistant" && lastMessage.isStreaming;

	const scrollToBottom = useCallback(() => {
		const messageListElement = messageListRef.current;
		if (!messageListElement) return;

		// smooth scroll to bottom
		const MARGIN = 5;
		messageListElement.scrollTo({
			top:
				messageListElement.scrollHeight -
				messageListElement.clientHeight -
				MARGIN,
			behavior: "smooth",
		});
	}, []);

	useEffect(() => {
		if (isLastMessageStreaming) {
			scrollToBottom();
		}
	}, [isLastMessageStreaming, scrollToBottom]);

	return (
		<div
			className={cn(
				"flex flex-col gap-2 h-full overflow-y-auto dark-lean-scrollbar scroll-smooth",
				props.className,
			)}
			ref={messageListRef}
		>
			{props.askAIText && (
				<div className="px-5 py-2 bg-[#2c394d] rounded-md border border-default-400">
					<p className="text-center font-bold"> Ask AI </p>
					<p className="text-white/80 text-center italic text-sm line-clamp-4">
						{props.askAIText}
					</p>
				</div>
			)}
			{/* display the messages except the last one */}
			{props.messages.length > 0 &&
				props.messages.slice(0, -1).map((message, index) => {
					let uniqueKey: string;
					if ("id" in message) {
						uniqueKey = message.id;
					} else {
						uniqueKey = message.role + index;
					}
					return <MessageItem key={uniqueKey} message={message} />;
				})}

			{/* display the last message with min height wrapper */}
			{props.messages.length > 0 && (
				<div
					style={{
						minHeight: useMinHeightWrapper ? "calc(100vh - 215px)" : "auto",
					}}
				>
					<MessageItem message={props.messages[props.messages.length - 1]} />
				</div>
			)}
		</div>
	);
}

function MessageItem(props: { message: DisplayedChatMessage }) {
	if (props.message.role === "user") {
		return <UserMessage message={props.message} />;
	} else {
		return <AssistantMessage message={props.message} />;
	}
}

type UserMessageProps = {
	message: DisplayedUserChatMessage;
};
function UserMessage(props: UserMessageProps) {
	return (
		<div className="border-b border-gray-700 py-4 mb-3">
			<MarkdownRenderer content={props.message.content} />
		</div>
	);
}

type AssistantMessageProps = {
	message: DisplayedAssistantChatMessage;
};
function AssistantMessage({ message }: AssistantMessageProps) {
	const { isStreaming, isError, errorCode, content, errorMessage } = message;
	const [typingContent, setTypingContent] = useState("");
	const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const currentIndexRef = useRef(0);
	const lastContentRef = useRef("");

	// const observerActions = useObserverAction();

	const hasContent = content.trim().length > 0;

	function renderMessage() {
		// if (isError) {
		// 	return (
		// 		<Alert
		// 			hideIcon
		// 			variant="faded"
		// 			color="warning"
		// 			className="py-3 px-2 flex flex-col gap-2"
		// 			classNames={{
		// 				mainWrapper: "w-full",
		// 			}}
		// 		>
		// 			<p className="mt-0">
		// 				{errorCode === AiErrorCodes.API_KEY_NOT_FOUND
		// 					? "API key not found. Please set your API key in the settings."
		// 					: errorMessage}
		// 			</p>
		// 			<div className="flex flex-col gap-2 w-full">
		// 				<Button
		// 					color="default"
		// 					variant="solid"
		// 					radius="md"
		// 					className="w-full"
		// 					onPress={() =>
		// 						observerActions.dispatch(
		// 							ObserverEventType.OPEN_CHAT_SETTING,
		// 							{},
		// 						)
		// 					}
		// 				>
		// 					<IconSettings className="w-4 h-4" />
		// 					Settings
		// 				</Button>
		// 				<Button
		// 					variant="default"
		// 					color="success"
		// 					className="w-full"
		// 					onClick={() => {
		// 						// observerActions.dispatch(
		// 						// 	ObserverEventType.RETRY_ERROR_MESSAGE,
		// 						// 	{},
		// 						// )
		// 					}}
		// 				>
		// 					<RefreshCcwIcon className="w-4 h-4" />
		// 					Retry
		// 				</Button>
		// 			</div>
		// 		</Alert>
		// 	);
		// }

		// // if the message is error, display the error message
		// if (isError) {
		// 	return (
		// 		<Alert variant="faded" color="danger" hideIconWrapper className="py-0">
		// 			{errorMessage}
		// 		</Alert>
		// 	);
		// }

		// if the message is streaming and has no content, display the loading message
		if (isStreaming && !hasContent) {
			return (
				<div className="flex items-center gap-2 text-gray-400">
					<Loader2Icon className="w-4 h-4 animate-spin" />
					<span>Thinking...</span>
				</div>
			);
		}

		// if the message is streaming and has content show typing animation
		if (isStreaming && hasContent) {
			return <MarkdownRenderer content={typingContent} />;
		}

		// if the message is not streaming or stop streaming, display the full message immediately
		if (!isStreaming && hasContent) {
			return <MarkdownRenderer content={content} />;
		}

		return null;
	}

	const animateTyping = useCallback(() => {
		const targetContent = content;
		const currentIndex = currentIndexRef.current;

		if (currentIndex < targetContent.length) {
			setTypingContent(targetContent.slice(0, currentIndex + 1));
			currentIndexRef.current++;

			// Use requestAnimationFrame for smooth animation
			animationTimeoutRef.current = setTimeout(animateTyping, 5);
		}
	}, [content]);

	useEffect(() => {
		// Cancel previous animation
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
			animationTimeoutRef.current = null;
		}

		// If not streaming, reset typing animation state and return early
		if (!isStreaming) {
			setTypingContent("");
			currentIndexRef.current = 0;
			lastContentRef.current = "";
			return;
		}

		// Only start new animation if content has changed
		const isContentChanged = content !== lastContentRef.current;
		if (!isContentChanged) return;

		const isContentIncreased = content.startsWith(lastContentRef.current);

		// Continue from where we left off if the content has increased
		if (isContentIncreased) {
			lastContentRef.current = content;
			animateTyping();
			return;
		}

		// Reset and start fresh if the content is not from the previous one
		currentIndexRef.current = 0;
		lastContentRef.current = content;
		setTypingContent("");
		animateTyping();
	}, [isStreaming, content, animateTyping]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div className="border-b border-gray-700 pb-2">
			<div className="flex items-start gap-2 mb-3">
				<div className="w-10 h-10 bg-accent flex items-center justify-center rounded-md">
					<GhostIcon className="w-6 h-6" />
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-sm text-gray-300 font-bold">OpenAI</p>
					<p className="text-xs text-gray-400">OpenAI o4 mini</p>
				</div>
			</div>
			<div className="prose prose-invert prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-base prose-a:underline">
				{renderMessage()}
			</div>
		</div>
	);
}
