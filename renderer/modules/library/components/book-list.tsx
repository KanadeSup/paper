import {
	Button,
	cn,
	getFileBasename,
	IconButton,
	ScrollArea,
	SearchInput,
	TagsGroup,
} from "@renderer/modules/design-system";
import { Link } from "@tanstack/react-router";
import Logger from "electron-log/renderer.js";
import { ImportIcon, Loader2, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useDocumentList } from "../hooks/useDocumentList";
import { updateDocument } from "../ipc/document.ipc";
import { DocumentCard } from "./document-card";
import {
	type EditableDocument,
	EditDocumentDialog,
	type EditDocumentFormValues,
} from "./edit-document-dialog";

export function BookList() {
	const { documents, isLoading, error, refresh } = useDocumentList();
	const [editingDocument, setEditingDocument] =
		useState<EditableDocument | null>(null);
	const [activeTags, setActiveTags] = useState<string[]>([]);

	const availableTags = useMemo(
		() =>
			[...new Set(documents.flatMap((document) => document.tags))].sort(
				(a, b) => a.localeCompare(b),
			),
		[documents],
	);

	// Ensure active tags are valid by removing any tags that are no longer in the available tags list
	const validActiveTags = useMemo(() => {
		return activeTags.filter((tag) => availableTags.includes(tag));
	}, [activeTags, availableTags]);

	const filteredDocuments = useMemo(() => {
		if (validActiveTags.length === 0) return documents;

		return documents.filter((document) =>
			validActiveTags.every((tag) => document.tags.includes(tag)),
		);
	}, [documents, validActiveTags]);

	const handleSave = async (data: EditDocumentFormValues) => {
		const response = await updateDocument({
			documentId: data.id,
			title: data.title?.trim() ? data.title.trim() : null,
			author: data.author?.trim() ? data.author.trim() : null,
			tags: data.tags,
		});

		if (!response.success) {
			Logger.error(response.errorMessage ?? "Failed to update document");
			toast.error("Failed to update document");
			return;
		}
		toast.success("Document updated successfully");

		await refresh(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<BookListToolbar isLoading={isLoading} onRefresh={refresh} />

			{availableTags.length > 0 && (
				<TagsGroup
					tags={availableTags}
					value={validActiveTags}
					onChange={setActiveTags}
				/>
			)}

			{error && (
				<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm">
					{error}
				</div>
			)}

			<ScrollArea className="min-h-0 flex-1 @container pr-4">
				{isLoading ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground">
						<Loader2 className="size-6 animate-spin" />
					</div>
				) : documents.length === 0 ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
						No documents found. Add PDF files to your storage directory.
					</div>
				) : filteredDocuments.length === 0 ? (
					<div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
						No documents match the selected tags.
					</div>
				) : (
					<div
						className={cn(
							"pt-2",
							"grid grid-cols-1 gap-4",
							"@3xs:grid-cols-1",
							"@2xs:grid-cols-1",
							"@xs:grid-cols-2",
							"@sm:grid-cols-2",
							"@md:grid-cols-3",
							"@lg:grid-cols-3",
							"@2xl:grid-cols-4",
							"@3xl:grid-cols-4",
							"@4xl:grid-cols-5",
							"@5xl:grid-cols-5",
							"@6xl:grid-cols-6",
							"@7xl:grid-cols-7",
							"@xl:gap-6",
						)}
					>
						{filteredDocuments.map((document) => (
							<Link to={`/library/${document.id}`} key={document.id}>
								<DocumentCard
									key={document.id}
									title={document.title ?? getFileBasename(document.fileName)}
									author={document.author}
									totalPages={document.totalPages}
									thumbnail={document.thumbnail}
									tags={document.tags}
									onEditClick={() =>
										setEditingDocument({
											id: document.id,
											title: document.title ?? undefined,
											author: document.author ?? undefined,
											totalPages: document.totalPages ?? undefined,
											thumbnail: document.thumbnail ?? undefined,
											fileName: document.fileName,
											fileSize: document.fileSize,
											tags: document.tags,
										})
									}
								/>
							</Link>
						))}
					</div>
				)}
			</ScrollArea>

			{editingDocument && (
				<EditDocumentDialog
					open={true}
					document={editingDocument}
					tagSuggestions={availableTags}
					onOpenChange={(open) => {
						if (!open) setEditingDocument(null);
					}}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}

type BookListToolbarProps = {
	isLoading: boolean;
	onRefresh: () => void;
};

export function BookListToolbar(props: BookListToolbarProps) {
	const { isLoading, onRefresh } = props;

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<SearchInput placeholder="Search" className="w-full sm:max-w-xs" />
			<div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
				<Button>
					<ImportIcon className="size-4" />
					Import Book
				</Button>
				<IconButton
					variant="secondary"
					onClick={onRefresh}
					disabled={isLoading}
					aria-label="Refresh document list"
				>
					<RefreshCcw className={cn("size-4", isLoading && "animate-spin")} />
				</IconButton>
			</div>
		</div>
	);
}
