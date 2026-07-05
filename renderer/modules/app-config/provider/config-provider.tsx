import { Button } from "@renderer/modules/design-system";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { RefreshCcwIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useConfigStore } from "../stores/config-store";

export type ConfigProviderProps = {
	children?: React.ReactNode;
};

export function ConfigProvider(props: ConfigProviderProps) {
	const { children } = props;

	const configActions = useConfigStore((state) => state.actions);
	const storagePath = useConfigStore((state) => state.appConfig.storagePath);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const loadConfig = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const success = await configActions.load();
			if (!success) {
				setError("Unexpected error while loading config");
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	}, [configActions]);

	useEffect(() => {
		loadConfig();
	}, [loadConfig]);

	useEffect(() => {
		if (!isLoading && !error && !storagePath) {
			navigate({ to: "/setup" });
		}
	}, [isLoading, error, storagePath, navigate]);

	if (isLoading) return null;
	if (error) return <ErrorPanel error={error} onRetry={() => loadConfig()} />;

	if (!storagePath && pathname !== "/setup") {
		return null;
	}

	return children;
}

type ErrorPanelProps = {
	error: string;
	onRetry: () => void;
};
function ErrorPanel(props: ErrorPanelProps) {
	const { error, onRetry } = props;
	return (
		<div className="h-screen flex flex-col items-center justify-center gap-2">
			<p className="text-destructive text-sm">{error}</p>
			<Button onClick={onRetry}>
				<RefreshCcwIcon className="size-3" />
				Retry
			</Button>
		</div>
	);
}
