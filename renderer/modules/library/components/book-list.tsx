import {
	Button,
	IconButton,
	SearchInput,
} from "@renderer/modules/design-system";
import { ImportIcon, RefreshCcw } from "lucide-react";
import { DocumentCard } from "./document-card";

export type BookListProps = {};

export function BookList(props: BookListProps) {
	return (
		<div className="flex flex-col gap-4">
			<BookListToolbar />
			<div className="grid grid-cols-5 gap-6">
				<DocumentCard title="Book 1" totalPages={100} author="Author 1" />
				<DocumentCard title="Book 2" totalPages={200} author="Author 2" />
				<DocumentCard title="Book 3" totalPages={300} author="Author 3" />
			</div>
		</div>
	);
}

export function BookListToolbar() {
	return (
		<div className="flex items-center justify-between">
			<SearchInput placeholder="Search" />
			<div className="flex items-center gap-2">
				<Button>
					<ImportIcon className="size-4" />
					Import Book
				</Button>
				<IconButton variant="secondary">
					<RefreshCcw className="size-4" />
				</IconButton>
			</div>
		</div>
	);
}
