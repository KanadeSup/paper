import {
	AnimatedMessage,
	Button,
	cn,
	IconButton,
	ScrollArea,
} from "@renderer/modules/design-system";
import { ErrorAlert } from "@renderer/modules/design-system/components/alert/error-alert";
import { MarkdownRenderer } from "@renderer/modules/design-system/components/markdown/markdown-renderer";
import { ArrowLeftIcon, RefreshCcwIcon } from "lucide-react";
import { motion } from "motion/react";

type GeneratedResultProps = {
	title: string;
	content: string;
	isStreaming: boolean;
	errorMessage: string | null;
	canRefresh: boolean;
	onBack: () => void;
	onRefresh: () => void;
};

export function GeneratedResult({
	title,
	content,
	isStreaming,
	errorMessage,
	canRefresh,
	onBack,
	onRefresh,
}: GeneratedResultProps) {
	return (
		<motion.div
			key="result"
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.14 }}
			className="flex h-full flex-col"
		>
			<div className="flex justify-between items-center gap-1 border-b border-border px-2 py-1.5">
				<Button variant="ghost" onClick={onBack}>
					<ArrowLeftIcon />
					<p className="truncate text-sm font-medium">{title}</p>
				</Button>
				<IconButton
					title="Refresh"
					onClick={onRefresh}
					disabled={isStreaming || !canRefresh}
				>
					<RefreshCcwIcon />
				</IconButton>
			</div>
			<ScrollArea className="min-h-0 flex-1">
				<div
					className={cn(
						"prose prose-sm dark:prose-invert prose-headings:my-2 prose-p:my-2",
						"max-w-none px-3 py-2",
					)}
				>
					{errorMessage ? (
						<ErrorAlert>
							<ErrorAlert.Title>
								<ErrorAlert.Indicator />
								Something went wrong
							</ErrorAlert.Title>
							<ErrorAlert.Description>{errorMessage}</ErrorAlert.Description>
							<ErrorAlert.Footer>
								<Button
									variant="default"
									className="w-full"
									onClick={onRefresh}
									disabled={!canRefresh}
								>
									<RefreshCcwIcon className="w-4 h-4" />
									Retry
								</Button>
							</ErrorAlert.Footer>
						</ErrorAlert>
					) : (
						<AnimatedMessage content={content} isStreaming={isStreaming}>
							{(displayedContent) => (
								<MarkdownRenderer content={displayedContent} />
							)}
						</AnimatedMessage>
					)}
				</div>
			</ScrollArea>
		</motion.div>
	);
}
