import {
	Button,
	cn,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	formatFileSize,
	Input,
	TagInput,
} from "@renderer/modules/design-system";
import { BookOpen } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export type EditableDocument = {
	id: string;
	title?: string | null;
	author?: string | null;
	totalPages?: number | null;
	thumbnail?: string | null;
	fileName?: string;
	fileSize?: number | null;
	tags: string[];
};

export type EditDocumentFormValues = {
	id: string;
	title: string | null;
	author: string | null;
	tags: string[];
};

export type EditDocumentDialogProps = {
	open: boolean;
	document: EditableDocument;
	tagSuggestions?: string[];
	onOpenChange: (open: boolean) => void;
	onSave: (data: EditDocumentFormValues) => void;
};

export function EditDocumentDialog(props: EditDocumentDialogProps) {
	const { open, document, tagSuggestions = [], onOpenChange, onSave } = props;

	const {
		control,
		formState: { isDirty, isValid },
		register,
		handleSubmit,
		reset,
	} = useForm<EditDocumentFormValues>({
		mode: "onChange",
		defaultValues: {
			id: "",
			title: "",
			author: "",
			tags: [],
		},
	});

	useEffect(() => {
		if (!open || !document) return;

		reset({
			id: document.id,
			title: document.title ?? "",
			author: document.author ?? "",
			tags: document.tags ?? [],
		});
	}, [open, document, reset]);

	const onFormSubmit = handleSubmit((data) => {
		onSave(data);
		onOpenChange(false);
	});

	const fileSizeLabel =
		document.fileSize != null ? formatFileSize(document.fileSize) : "—";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl" showCloseButton>
				<DialogHeader>
					<DialogTitle>Edit document</DialogTitle>
					<DialogDescription>
						Update the title, author, and tags for this document.
					</DialogDescription>
				</DialogHeader>

				<form
					id="edit-document-form"
					onSubmit={onFormSubmit}
					className="flex flex-col gap-5"
				>
					<div className="flex gap-5">
						{/* Thumbnail */}
						<div
							className={cn(
								"relative aspect-3/4 w-40 shrink-0 overflow-hidden rounded-lg bg-muted",
								"shrink-0",
							)}
						>
							{document.thumbnail ? (
								<img
									src={document.thumbnail}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
									<BookOpen
										className="size-7 text-muted-foreground/40"
										strokeWidth={1.5}
									/>
								</div>
							)}
						</div>

						<div className="flex min-w-0 flex-1 flex-col gap-5">
							{/* Title */}
							<FormField label="Title">
								<Input {...register("title")} placeholder="Document title" />
							</FormField>

							{/* Author */}
							<FormField label="Author">
								<Input {...register("author")} placeholder="Author name" />
							</FormField>

							{/* Tags */}
							<FormField
								label="Tags"
								hint="Select a suggestion or press Enter to create a new tag."
							>
								<Controller
									name="tags"
									control={control}
									render={({ field }) => (
										<TagInput
											value={field.value}
											onChange={field.onChange}
											suggestions={tagSuggestions}
											placeholder="Add a tag…"
										/>
									)}
								/>
							</FormField>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<FormField label="ID">
							<Input
								{...register("id")}
								readOnly
								tabIndex={-1}
								className="font-mono text-xs text-muted-foreground"
							/>
						</FormField>

						<FormField label="File name">
							<Input
								value={document.fileName}
								readOnly
								tabIndex={-1}
								title={document.fileName}
								className="truncate text-muted-foreground"
							/>
						</FormField>

						<FormField label="Pages">
							<Input
								value={
									document.totalPages != null
										? String(document.totalPages)
										: "—"
								}
								readOnly
								tabIndex={-1}
								className="text-muted-foreground"
							/>
						</FormField>

						<FormField label="File size">
							<Input
								value={fileSizeLabel}
								readOnly
								tabIndex={-1}
								className="text-muted-foreground"
							/>
						</FormField>
					</div>
				</form>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						form="edit-document-form"
						disabled={!isDirty || !isValid}
					>
						Save change
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

type FormFieldProps = {
	label: string;
	hint?: string;
	required?: boolean;
	children: ReactNode;
};

function FormField({ label, hint, required, children }: FormFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex flex-col gap-0.5">
				<p className="text-sm font-medium leading-none">
					{label}
					{required ? <span className="ml-0.5 text-destructive">*</span> : null}
				</p>
				{hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
			</div>
			{children}
		</div>
	);
}
