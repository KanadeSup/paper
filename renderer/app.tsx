import { createRoot } from "react-dom/client";
import "./app.css";
import { AppLayout } from "./app-layout/components/app-layout";
import { AppTitle } from "./app-layout/components/app-title";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const root = createRoot(rootElement);
root.render(
	<AppLayout>
		<AppTitle>Hello from React!</AppTitle>
	</AppLayout>,
);
