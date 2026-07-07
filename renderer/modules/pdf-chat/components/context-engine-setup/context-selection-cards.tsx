import { cn } from "@renderer/modules/design-system";
import { BrainCircuitIcon, ListTreeIcon } from "lucide-react";
import type React from "react";

type ContextSelectionCardsProps = {
	onSelectRag: () => void;
	onSelectOutline: () => void;
};

export function ContextSelectionCards({
	onSelectRag,
	onSelectOutline,
}: ContextSelectionCardsProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full px-3 py-6 gap-5">
			<div className="text-center space-y-1">
				<p className="text-sm font-semibold">Choose a context source</p>
				<p className="text-xs text-muted-foreground leading-relaxed">
					Select how the AI should access your document before chatting.
				</p>
			</div>

			<div className="flex flex-col gap-3 w-full">
				<ContextCard
					icon={<BrainCircuitIcon className="size-5" />}
					title="RAG Context"
					description="Automatically retrieve the most relevant sections using AI-powered semantic search."
					onClick={onSelectRag}
				/>
				<ContextCard
					icon={<ListTreeIcon className="size-5" />}
					title="Outline Context"
					description="Manually pick a chapter or section to focus the conversation on."
					onClick={onSelectOutline}
				/>
			</div>
		</div>
	);
}

type ContextCardProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	onClick: () => void;
};

function ContextCard({ icon, title, description, onClick }: ContextCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-full text-left p-3.5 rounded-lg",
				"border border-border/50 bg-muted/20",
				"hover:bg-accent/50 hover:border-border",
				"transition-all duration-150 group cursor-pointer",
			)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"mt-0.5 shrink-0 rounded-md p-1.5",
						"bg-accent/60 text-muted-foreground",
						"group-hover:bg-primary/15 group-hover:text-primary",
						"transition-colors duration-150",
					)}
				>
					{icon}
				</div>
				<div className="min-w-0">
					<p className="text-sm font-medium leading-snug">{title}</p>
					<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
						{description}
					</p>
				</div>
			</div>
		</button>
	);
}
