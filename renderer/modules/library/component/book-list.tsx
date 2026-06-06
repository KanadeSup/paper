import { DocumentCard } from "./document-card";

export type BookListProps = {};

export function BookList(props: BookListProps) {
	return (
		<div className="grid grid-cols-5 gap-6">
			<DocumentCard title="Book 1" totalPages={100} author="Author 1" />
			<DocumentCard title="Book 2" totalPages={200} author="Author 2" />
			<DocumentCard title="Book 3" totalPages={300} author="Author 3" />
		</div>
	);
}
