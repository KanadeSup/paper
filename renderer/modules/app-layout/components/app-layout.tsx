import { cn } from "@renderer/modules/design-system";
import { motion } from "motion/react";
import {
	AppLayoutProvider,
	useAppLayoutStore,
} from "../provider/app-layout-provider";
import { AppSidebar } from "./app-sidebar";

export type AppLayoutProps = {
	className?: string;
	children?: React.ReactNode;
};

export function AppLayout(props: AppLayoutProps) {
	const { children, className } = props;

	return (
		<AppLayoutProvider>
			<AppLayoutView className={className}>{children}</AppLayoutView>
		</AppLayoutProvider>
	);
}

export function AppLayoutView(props: AppLayoutProps) {
	const { children, className } = props;

	const isSidebarOpen = useAppLayoutStore((state) => state.isSidebarOpen);

	return (
		<div className="flex h-screen w-screen gap-4 overflow-hidden p-3">
			<motion.aside
				animate={{
					width: isSidebarOpen ? 288 : 0,
					opacity: isSidebarOpen ? 1 : 1,
				}}
				className="shrink-0 overflow-hidden"
			>
				<motion.div
					animate={{
						x: isSidebarOpen ? 0 : -300,
					}}
					transition={{
						duration: 0.2,
						ease: "easeInOut",
					}}
					className="h-full w-72"
				>
					<AppSidebar className="w-full" />
				</motion.div>
			</motion.aside>
			<motion.main
				layout
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className={cn("flex min-h-0 min-w-0 flex-1 flex-col", className)}
			>
				{children}
			</motion.main>
		</div>
	);
}
