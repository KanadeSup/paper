import { AppLayout, AppTitle } from "../app-layout";
import { BookList } from "./components/book-list";

export function LibraryPage() {
	return (
		<AppLayout className="flex h-full min-h-0 flex-col gap-4">
			<AppTitle>
				<h1 className="font-semibold text-lg">Library</h1>
			</AppTitle>
			<BookList />
		</AppLayout>
	);
}
