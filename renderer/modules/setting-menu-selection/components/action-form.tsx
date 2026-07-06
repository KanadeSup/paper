import { Button, cn, Input, ScrollArea } from "@renderer/modules/design-system";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renderer/modules/design-system/components/ui/select";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { DEFAULT_LLM_MODEL, LLM_MODEL_OPTIONS } from "../constants/llm-models";
import {
	type MenuActionFormValues,
	SYSTEM_PLACEHOLDERS,
} from "../types/menu-action.type";

export type ActionFormProps = {
	mode: "create" | "edit";
	title: string;
	defaultValues?: Partial<MenuActionFormValues>;
	onSubmit: (data: MenuActionFormValues) => void;
	onCancel: () => void;
};

export function ActionForm({
	mode,
	title,
	defaultValues,
	onSubmit,
	onCancel,
}: ActionFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isDirty, isValid },
	} = useForm<MenuActionFormValues>({
		defaultValues: {
			name: defaultValues?.name ?? "",
			description: defaultValues?.description ?? "",
			prompt: defaultValues?.prompt ?? "",
			model: defaultValues?.model ?? DEFAULT_LLM_MODEL,
		},
		mode: "onChange",
	});

	const promptValue = watch("prompt");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { ref: rhfPromptRef, ...promptRest } = register("prompt");

	// Combine react-hook-form's ref with our own ref for cursor tracking
	const setTextareaRef = useCallback(
		(el: HTMLTextAreaElement | null) => {
			textareaRef.current = el;
			rhfPromptRef(el);
		},
		[rhfPromptRef],
	);

	const insertPlaceholder = (key: string) => {
		const el = textareaRef.current;
		const current = promptValue ?? "";
		if (!el) {
			setValue("prompt", current + key, { shouldDirty: true });
			return;
		}
		const start = el.selectionStart ?? current.length;
		const end = el.selectionEnd ?? current.length;
		const next = current.slice(0, start) + key + current.slice(end);
		setValue("prompt", next, { shouldDirty: true });
		requestAnimationFrame(() => {
			el.focus();
			const cursor = start + key.length;
			el.setSelectionRange(cursor, cursor);
		});
	};

	const onFormSubmit = handleSubmit((data) => {
		onSubmit(data);
	});

	const isSubmitDisabled = mode === "edit" ? !isDirty || !isValid : !isValid;
	const submitLabel = mode === "create" ? "Create Action" : "Save Changes";

	return (
		<div className="flex flex-col gap-4 p-3 h-full overflow-hidden w-full">
			{/* Breadcrumb */}
			<div className="flex items-center gap-1.5 text-sm">
				<button
					type="button"
					onClick={onCancel}
					className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
				>
					<ArrowLeftIcon className="size-3.5" />
					<span>Menu Selection</span>
				</button>
				<ChevronRightIcon className="size-3 text-muted-foreground/40" />
				<span className="font-medium text-foreground truncate max-w-48">
					{title}
				</span>
			</div>

			<ScrollArea className="flex-1 min-h-0 overflow-auto pr-3">
				<form
					id="action-form"
					onSubmit={onFormSubmit}
					className="flex flex-col gap-5 pr-1 pb-2"
				>
					{/* Name */}
					<FormField label="Action Name" required error={errors.name?.message}>
						<Input
							{...register("name", { required: "Action name is required" })}
							placeholder="e.g. Summarize"
							aria-invalid={!!errors.name}
							maxLength={50}
						/>
					</FormField>

					{/* Description */}
					<FormField
						label="Description"
						hint="Shown below the action name in the settings list."
					>
						<Input
							{...register("description")}
							placeholder="Briefly describe what this action does"
							maxLength={255}
						/>
					</FormField>

					{/* Model */}
					<FormField
						label="Model"
						required
						hint="The LLM used when this action is triggered."
						error={errors.model?.message}
					>
						<Select
							{...register("model", { required: "Model is required" })}
							value={watch("model")}
							onValueChange={(value) =>
								setValue("model", value, { shouldDirty: true })
							}
						>
							<SelectTrigger className="min-w-48">
								<SelectValue placeholder="Select a model" />
							</SelectTrigger>
							<SelectContent>
								{LLM_MODEL_OPTIONS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormField>

					{/* Prompt */}
					<FormField
						label="Prompt"
						hint="The prompt sent to the AI when this action is triggered. Use placeholders to inject dynamic content at runtime."
					>
						<div className="flex flex-col gap-2">
							{/* Placeholder chips */}
							<div className="flex flex-col gap-1.5">
								<span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
									Insert placeholder
								</span>
								<div className="flex flex-wrap gap-1.5">
									{SYSTEM_PLACEHOLDERS.map((p) => (
										<button
											key={p.key}
											type="button"
											title={p.description}
											onClick={() => insertPlaceholder(p.key)}
											className={cn(
												"inline-flex items-center px-2 py-1 rounded-md",
												"text-[11px] font-mono font-medium",
												"bg-primary/8 text-primary border border-primary/20",
												"hover:bg-primary/15 hover:border-primary/35",
												"transition-colors duration-150 cursor-pointer",
											)}
										>
											{p.key}
										</button>
									))}
								</div>
							</div>

							{/* Textarea */}
							<textarea
								{...promptRest}
								ref={setTextareaRef}
								placeholder={
									"Write the prompt that will be sent to the AI.\n\nUse placeholders like {{selected_text}} or {{document_title}} — they will be replaced with actual values at runtime."
								}
								className={cn(
									"w-full min-h-72 resize-y rounded-lg border border-input",
									"bg-transparent px-3 py-2.5 text-sm leading-relaxed",
									"placeholder:text-muted-foreground/50",
									"focus-visible:outline-none focus-visible:border-ring",
									"transition-colors duration-150 font-mono",
									"dark:bg-input/30",
								)}
								spellCheck={false}
							/>

							{/* Placeholder reference */}
							<div className="rounded-lg border border-border bg-muted/30 p-3 flex flex-col gap-2">
								<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
									Available placeholders
								</p>
								<div className="flex flex-col gap-1.5">
									{SYSTEM_PLACEHOLDERS.map((p) => (
										<div key={p.key} className="flex items-baseline gap-2">
											<code className="text-[11px] font-mono text-primary shrink-0">
												{p.key}
											</code>
											<span className="text-xs text-muted-foreground">
												— {p.description}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</FormField>
				</form>
			</ScrollArea>

			{/* Footer */}
			<div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
				<Button variant="ghost" type="button" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" form="action-form" disabled={isSubmitDisabled}>
					{submitLabel}
				</Button>
			</div>
		</div>
	);
}

type FormFieldProps = {
	label: string;
	hint?: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
};

function FormField({ label, hint, required, error, children }: FormFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex flex-col gap-0.5">
				<p className="text-sm font-medium leading-none">
					{label}
					{required && <span className="text-destructive ml-0.5">*</span>}
				</p>
				{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
			</div>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	);
}
