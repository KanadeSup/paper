import { AnimatePresence, motion } from "motion/react";
import {
	AppLayoutProvider,
	useAppLayoutStore,
} from "../provider/app-layout-provider";
import { AppSidebar } from "./app-sidebar";

export type AppLayoutProps = {
	children?: React.ReactNode;
};

export function AppLayout(props: AppLayoutProps) {
	const { children } = props;

	return (
		<AppLayoutProvider>
			<AppLayoutView>{children}</AppLayoutView>
		</AppLayoutProvider>
	);
}

export function AppLayoutView(props: AppLayoutProps) {
	const { children } = props;

	const isSidebarOpen = useAppLayoutStore((state) => state.isSidebarOpen);
	console.log(isSidebarOpen);

	return (
		<div className="flex h-screen w-screen p-3 gap-4">
			<AnimatePresence mode="popLayout">
				{isSidebarOpen && (
					<motion.div
						layout
						initial={{ x: -256, opacity: 1 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -256, opacity: 1 }}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
						}}
						className="w-72 h-full shrink-0"
					>
						<AppSidebar className="w-full" />
					</motion.div>
				)}
			</AnimatePresence>
			<motion.main
				layout
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="flex-1"
			>
				{children}
			</motion.main>
		</div>
	);
}
