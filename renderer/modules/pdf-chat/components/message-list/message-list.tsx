import { Button, cn } from "@renderer/modules/design-system";
import { ErrorAlert } from "@renderer/modules/design-system/components/alert/error-alert";
import { MarkdownRenderer } from "@renderer/modules/design-system/components/markdown/markdown-renderer";
import { Loader2Icon, MessageCircleIcon, RefreshCcwIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	DisplayedAssistantChatMessage,
	DisplayedChatMessage,
	DisplayedUserChatMessage,
} from "../../types/chat.type";
import type { ContextEngine } from "../../types/context-engine.type";
import { ChatContextCard } from "./chat-context-card";

type ChatMessageListProps = {
	messages: DisplayedChatMessage[];
	contextEngine?: ContextEngine;
	askAIText?: string | null;
	className?: string;
	scrollContainer?: HTMLDivElement | null;
	onReselectContext?: () => void;
	onSuggestedPrompt?: (prompt: string) => void;
};

// ------------- Chat Message List Component -------------
export function ChatMessageList(props: ChatMessageListProps) {
	const lastMessage =
		props.messages.length > 0
			? props.messages[props.messages.length - 1]
			: null;
	const useMinHeightWrapper = lastMessage && lastMessage.role === "assistant";
	const isLastMessageStreaming =
		lastMessage && lastMessage.role === "assistant" && lastMessage.isStreaming;

	const scrollToBottom = useCallback(() => {
		const scrollContainer = props.scrollContainer;
		if (!scrollContainer) return;

		// smooth scroll to bottom
		scrollContainer.scrollTo({
			top: scrollContainer.scrollHeight - scrollContainer.clientHeight,
			behavior: "smooth",
		});
	}, [props.scrollContainer]);

	useEffect(() => {
		if (isLastMessageStreaming) {
			scrollToBottom();
		}
	}, [isLastMessageStreaming, scrollToBottom]);

	const isEmpty = props.messages.length === 0;

	return (
		<div className={cn("flex flex-col gap-2 h-full", props.className)}>
			{props.contextEngine && (
				<ChatContextCard
					contextEngine={props.contextEngine}
					onReselect={props.onReselectContext ?? (() => {})}
				/>
			)}
			{props.askAIText && (
				<div className="px-5 py-2 bg-[#2c394d] rounded-md border border-default-400">
					<p className="text-center font-bold"> Ask AI </p>
					<p className="text-white/80 text-center italic text-sm line-clamp-4">
						{props.askAIText}
					</p>
				</div>
			)}

			{/* Empty state when context is set but no messages yet */}
			{isEmpty && props.contextEngine && (
				<EmptyState
					contextEngine={props.contextEngine}
					onSuggestedPrompt={props.onSuggestedPrompt}
				/>
			)}

			{/* display the messages except the last one */}
			{!isEmpty &&
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
			{!isEmpty && (
				<div
					style={{
						minHeight: useMinHeightWrapper ? "calc(100vh - 270px)" : "auto",
					}}
				>
					<MessageItem message={props.messages[props.messages.length - 1]} />
				</div>
			)}
		</div>
	);
}

// ------------- Empty State Component -------------
const RAG_SUGGESTIONS = [
	"Summarize the key points of this document",
	"What are the main conclusions?",
	"Explain the most important concepts",
	"What questions does this document answer?",
];

const OUTLINE_SUGGESTIONS = [
	"Summarize this chapter",
	"What are the key takeaways?",
	"Explain the main ideas in simple terms",
	"What does this section cover?",
];

type EmptyStateProps = {
	contextEngine: NonNullable<ContextEngine>;
	onSuggestedPrompt?: (prompt: string) => void;
};

function EmptyState({ contextEngine, onSuggestedPrompt }: EmptyStateProps) {
	const suggestions =
		contextEngine.type === "outline" ? OUTLINE_SUGGESTIONS : RAG_SUGGESTIONS;

	return (
		<div className="flex flex-col items-center gap-4 py-6 px-1">
			<div className="flex flex-col items-center gap-2 text-center">
				<div className="flex items-center justify-center size-10 rounded-full bg-white/5 border border-white/10">
					<MessageCircleIcon className="size-5 text-white/40" />
				</div>
				<p className="text-sm font-medium text-white/70">
					Ready to chat about your document
				</p>
				<p className="text-xs text-white/40 leading-relaxed">
					Ask anything about the content — I'll use the selected context to
					answer accurately.
				</p>
			</div>

			<div className="w-full flex flex-col gap-1.5">
				<p className="text-xs font-semibold uppercase tracking-wide text-white/30 mb-0.5">
					Suggestions
				</p>
				{suggestions.map((prompt) => (
					<button
						key={prompt}
						type="button"
						onClick={() => onSuggestedPrompt?.(prompt)}
						className={cn(
							"w-full text-left px-3 py-2 rounded-lg text-xs text-white/60",
							"bg-white/3 border border-white/[0.07]",
							"hover:bg-white/[0.07] hover:text-white/90 hover:border-white/15",
							"transition-all duration-150",
							onSuggestedPrompt ? "cursor-pointer" : "cursor-default",
						)}
					>
						{prompt}
					</button>
				))}
			</div>
		</div>
	);
}

// ------------- Message Item Component -------------
function MessageItem(props: { message: DisplayedChatMessage }) {
	if (props.message.role === "user") {
		return <UserMessage message={props.message} />;
	} else {
		return <AssistantMessage message={props.message} />;
	}
}

// ------------- User Message Component -------------
type UserMessageProps = {
	message: DisplayedUserChatMessage;
};
function UserMessage(props: UserMessageProps) {
	return (
		<div className="flex justify-end pl-3 mb-3">
			<div className="p-2 px-3 text-sm bg-accent rounded-xl min-w-0 break-all">
				<MarkdownRenderer content={props.message.content} />
			</div>
		</div>
	);
}

// ------------- Assistant Message Component -------------
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
		if (isError) {
			return (
				<ErrorAlert className="mt-2">
					<ErrorAlert.Title>
						<ErrorAlert.Indicator />
						{errorCode === "API_KEY_NOT_FOUND"
							? "Unable to find api key"
							: "Something went wrong"}
					</ErrorAlert.Title>
					<ErrorAlert.Description>
						{errorCode === "API_KEY_NOT_FOUND"
							? "API key not found. Please set your API key in the settings."
							: errorMessage}
					</ErrorAlert.Description>
					<ErrorAlert.Footer>
						<Button variant="default" className="w-full">
							<RefreshCcwIcon className="w-4 h-4" />
							Retry
						</Button>
					</ErrorAlert.Footer>
				</ErrorAlert>
			);
		}

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
		<div className="mb-3 border-b border-accent">
			<div className="flex items-start gap-2">
				<p className="text-xs text-gray-300 font-bold">{message.model}</p>
			</div>
			<div className="prose prose-invert prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-sm prose-a:underline">
				{renderMessage()}
			</div>
		</div>
	);
}
