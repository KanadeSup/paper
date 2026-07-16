import { ConfigProvider } from "@renderer/modules/app-config";
import { Toaster } from "@renderer/modules/design-system/components";
import { ShortcutProvider } from "@renderer/modules/shortcut/providers/shortcut-provider";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
	<ConfigProvider>
		<ShortcutProvider>
			<Outlet />
			<Toaster richColors />
		</ShortcutProvider>
	</ConfigProvider>
);

export const Route = createRootRoute({ component: RootLayout });
