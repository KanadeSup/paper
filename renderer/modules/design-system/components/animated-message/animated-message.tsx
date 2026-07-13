import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type AnimatedMessageProps = {
	content: string;
	isStreaming: boolean;
	typingIntervalMs?: number;
	className?: string;
	children?: (displayedContent: string) => React.ReactNode;
};

export function AnimatedMessage({
	content,
	isStreaming,
	typingIntervalMs = 5,
	className,
	children,
}: AnimatedMessageProps) {
	const [typingContent, setTypingContent] = useState("");
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const currentIndexRef = useRef(0);
	const lastContentRef = useRef("");

	const hasContent = content.trim().length > 0;

	const clearAnimation = useCallback(() => {
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
			animationTimeoutRef.current = null;
		}
	}, []);

	const animateTyping = useCallback(() => {
		const targetContent = content;
		const currentIndex = currentIndexRef.current;

		if (currentIndex < targetContent.length) {
			setTypingContent(targetContent.slice(0, currentIndex + 1));
			currentIndexRef.current++;
			animationTimeoutRef.current = setTimeout(animateTyping, typingIntervalMs);
		}
	}, [content, typingIntervalMs]);

	/** Handle the streaming of the message */
	useEffect(() => {
		clearAnimation();

		if (!isStreaming) {
			setTypingContent("");
			currentIndexRef.current = 0;
			lastContentRef.current = "";
			return;
		}

		const isContentChanged = content !== lastContentRef.current;
		if (!isContentChanged) return;

		const isContentIncreased = content.startsWith(lastContentRef.current);

		if (isContentIncreased) {
			lastContentRef.current = content;
			animateTyping();
			return;
		}

		currentIndexRef.current = 0;
		lastContentRef.current = content;
		setTypingContent("");
		animateTyping();
	}, [isStreaming, content, animateTyping, clearAnimation]);

	/** Clean up the animation when the component unmounts */
	useEffect(() => {
		return () => {
			clearAnimation();
		};
	}, [clearAnimation]);

	if (isStreaming && !hasContent) {
		return (
			<div className="flex items-center gap-2 text-gray-400">
				<Loader2Icon className="w-4 h-4 animate-spin" />
				<span>Thinking...</span>
			</div>
		);
	}

	const displayedContent = isStreaming ? typingContent : content;

	if (!hasContent && !isStreaming) {
		return null;
	}

	const rendered = children ? children(displayedContent) : displayedContent;

	return <div className={className}>{rendered}</div>;
}
