import { createRoot } from "react-dom/client";
import "./app.css";
import { AppLayout } from "./modules/components/app-layout";
import { AppTitle } from "./modules/components/app-title";

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
