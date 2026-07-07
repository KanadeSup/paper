import { cn } from "@renderer/modules/design-system";
import { BookOpenIcon, BotIcon, PencilIcon, SparklesIcon } from "lucide-react";
import type { ContextEngine } from "../../types/context-engine.type";

type ChatContextCardProps = {
	contextEngine: ContextEngine;
	onReselect: () => void;
};

export function ChatContextCard({
	contextEngine,
	onReselect,
}: ChatContextCardProps) {
	if (!contextEngine) return null;

	if (contextEngine.type === "rag") {
		const isOpenAI = contextEngine.engine === "openai";
		return (
			<ContextCard
				icon={
					isOpenAI ? (
						<SparklesIcon className="size-3.5" />
					) : (
						<BotIcon className="size-3.5" />
					)
				}
				label="RAG Context"
				value={isOpenAI ? "OpenAI RAG" : "Built-in RAG"}
				description="Relevant document sections will be retrieved automatically."
				colorClass="text-violet-400 bg-violet-400/10 border-violet-400/20"
				dotClass="bg-violet-400"
				onReselect={onReselect}
			/>
		);
	}

	if (contextEngine.type === "outline") {
		return (
			<ContextCard
				icon={<BookOpenIcon className="size-3.5" />}
				label="Outline Context"
				value={contextEngine.outlineItem.title ?? "Selected chapter"}
				description="The AI will answer based on this chapter's content."
				colorClass="text-sky-400 bg-sky-400/10 border-sky-400/20"
				dotClass="bg-sky-400"
				onReselect={onReselect}
			/>
		);
	}

	return null;
}

type ContextCardInnerProps = {
	icon: React.ReactNode;
	label: string;
	value: string;
	description: string;
	colorClass: string;
	dotClass: string;
	onReselect: () => void;
};

function ContextCard({
	icon,
	label,
	value,
	description,
	colorClass,
	dotClass,
	onReselect,
}: ContextCardInnerProps) {
	return (
		<div className={cn("rounded-lg border px-3 py-2.5 mb-1", colorClass)}>
			<div className="flex items-center gap-2 mb-1">
				<span
					className={cn(
						"inline-flex items-center justify-center",
						colorClass.split(" ")[0],
					)}
				>
					{icon}
				</span>
				<span className="text-xs font-semibold uppercase tracking-wide opacity-70">
					{label}
				</span>
				<span
					className={cn("ml-auto size-1.5 rounded-full shrink-0", dotClass)}
				/>
			</div>

			<div className="flex items-end justify-between gap-2">
				<div className="min-w-0">
					<p className="text-sm font-medium truncate">{value}</p>
					<p className="text-xs opacity-60 mt-0.5 leading-relaxed">
						{description}
					</p>
				</div>

				<button
					type="button"
					onClick={onReselect}
					title="Change context"
					className={cn(
						"shrink-0 flex items-center gap-1 rounded-md px-2 py-1",
						"text-xs font-medium opacity-60 hover:opacity-100",
						"bg-white/5 hover:bg-white/10 transition-all duration-150",
						"border border-white/10 hover:border-white/20",
					)}
				>
					<PencilIcon className="size-3" />
					Change
				</button>
			</div>
		</div>
	);
}
