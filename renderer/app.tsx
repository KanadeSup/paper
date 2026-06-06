import { createRoot } from "react-dom/client";
import "./app.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Root element not found");
}
const root = createRoot(rootElement);

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
});
root.render(<RouterProvider router={router} />);
