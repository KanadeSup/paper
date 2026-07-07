import { cn, IconButton } from "@renderer/modules/design-system";
import { Loader2, SendIcon } from "lucide-react";
import { useState } from "react";

export type ChatInputState = "ACTIVE" | "LOADING";
export type ChatInputProps = {
	state?: ChatInputState;
	className?: string;
	onSubmit?: (message: string) => void;
};
export function ChatInput(props: ChatInputProps) {
	const { state = "ACTIVE", className, onSubmit } = props;

	const [message, setMessage] = useState("");

	const handleSubmit = () => {
		if (state === "LOADING") return;
		onSubmit?.(message);
		setMessage("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className={cn("w-full h-full bg-sidebar rounded-md p-3", className)}>
			<textarea
				className="h-24 w-full resize-none focus-within:outline-none"
				placeholder="Enter the message ..."
				spellCheck={false}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<div className="flex items-center justify-end mt-2">
				<IconButton
					variant="outline"
					disabled={state === "LOADING"}
					onClick={handleSubmit}
				>
					{state === "LOADING" ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<SendIcon className="size-4" />
					)}
				</IconButton>
			</div>
		</div>
	);
}
