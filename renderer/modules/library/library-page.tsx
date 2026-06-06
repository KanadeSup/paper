import { AppLayout } from "../components/app-layout";
import { AppTitle } from "../components/app-title";
import { BookList } from "./components/book-list";

export function LibraryPage() {
	return (
		<AppLayout>
			<AppTitle>
				<h1 className="font-semibold text-lg">Library</h1>
			</AppTitle>
			<BookList />
		</AppLayout>
	);
}
