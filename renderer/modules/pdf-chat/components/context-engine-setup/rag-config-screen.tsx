import { cn } from "@renderer/modules/design-system";
import { ArrowLeftIcon, BotIcon, CheckIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import type { RagEngine } from "../../types/context-engine.type";

type RagConfigScreenProps = {
	onBack: () => void;
	onConfirm: (engine: RagEngine) => void;
};

export function RagConfigScreen({ onBack, onConfirm }: RagConfigScreenProps) {
	const [selectedEngine, setSelectedEngine] = useState<RagEngine | null>(null);

	return (
		<div className="flex flex-col h-full px-3 py-4 gap-5">
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
			>
				<ArrowLeftIcon className="size-3.5" />
				Back
			</button>

			<div className="space-y-1">
				<p className="text-sm font-semibold">RAG Context</p>
				<p className="text-xs text-muted-foreground leading-relaxed">
					Choose a retrieval engine. It will search your document for relevant
					context before every response.
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<EngineOption
					icon={<SparklesIcon className="size-4" />}
					title="OpenAI RAG"
					description="Uses OpenAI embeddings for high-quality semantic search."
					selected={selectedEngine === "openai"}
					onSelect={() => setSelectedEngine("openai")}
				/>
				<EngineOption
					icon={<BotIcon className="size-4" />}
					title="Built-in RAG"
					description="Local retrieval engine — works fully offline."
					selected={selectedEngine === "builtin"}
					onSelect={() => setSelectedEngine("builtin")}
				/>
			</div>

			<div className="mt-auto">
				<button
					type="button"
					disabled={!selectedEngine}
					onClick={() => selectedEngine && onConfirm(selectedEngine)}
					className={cn(
						"w-full h-8 rounded-lg text-sm font-medium transition-all duration-150",
						"border border-transparent",
						selectedEngine
							? "bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
							: "bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50",
					)}
				>
					Start chatting
				</button>
			</div>
		</div>
	);
}

type EngineOptionProps = {
	icon: React.ReactNode;
	title: string;
	description: string;
	selected: boolean;
	onSelect: () => void;
};

function EngineOption({
	icon,
	title,
	description,
	selected,
	onSelect,
}: EngineOptionProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				"w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer",
				selected
					? "border-primary/50 bg-primary/10"
					: "border-border/50 bg-muted/20 hover:bg-accent/40 hover:border-border",
			)}
		>
			<div className="flex items-center gap-3">
				<div
					className={cn(
						"shrink-0 rounded-md p-1.5 transition-colors duration-150",
						selected
							? "bg-primary/20 text-primary"
							: "bg-accent/60 text-muted-foreground",
					)}
				>
					{icon}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium leading-snug">{title}</p>
					<p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
						{description}
					</p>
				</div>
				{selected && <CheckIcon className="size-4 shrink-0 text-primary" />}
			</div>
		</button>
	);
}
