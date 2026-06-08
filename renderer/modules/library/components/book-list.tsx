import {
	Button,
	cn,
	getFileBasename,
	IconButton,
	ScrollArea,
	SearchInput,
} from "@renderer/modules/design-system";
import { Link } from "@tanstack/react-router";
import { ImportIcon, Loader2, RefreshCcw } from "lucide-react";
import { useDocumentList } from "../hooks/useDocumentList";
import { DocumentCard } from "./document-card";

export function BookList() {
	const { documents, isLoading, error, refresh } = useDocumentList();

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<BookListToolbar isLoading={isLoading} onRefresh={refresh} />

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
				) : (
					<div
						className={cn(
							"grid grid-cols-1 gap-4",
							"@md:grid-cols-2",
							"@2xl:grid-cols-3",
							"@3xl:grid-cols-4",
							"@4xl:grid-cols-5",
							"@xl:gap-6",
						)}
					>
						{documents.map((document) => (
							<Link to={`/library/${document.id}`} key={document.id}>
								<DocumentCard
									key={document.id}
									title={document.title ?? getFileBasename(document.fileName)}
									author={document.author}
									totalPages={document.totalPages}
									thumbnail={document.thumbnail}
								/>
							</Link>
						))}
					</div>
				)}
			</ScrollArea>
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
