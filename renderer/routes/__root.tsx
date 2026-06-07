import { ConfigProvider } from "@renderer/modules/app-config";
import { Toaster } from "@renderer/modules/design-system/components";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
	<ConfigProvider>
		<Outlet />
		<Toaster richColors />
	</ConfigProvider>
);

export const Route = createRootRoute({ component: RootLayout });
