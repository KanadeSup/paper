import { createRoot } from "react-dom/client";
import "./app.css";
import { Button } from "./design-system/components/ui/button";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const root = createRoot(rootElement);
root.render(<Button>Hello from React!</Button>);
