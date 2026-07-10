import { Button, cn, IconButton } from "@renderer/modules/design-system";
import { Loader2Icon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { ApiKeyProviderMeta } from "../constants/providers";
import { validateApiKey } from "../ipc/api-key.ipc";
import { ApiKeySecretInput } from "./api-key-secret-input";

export type ApiKeyProviderCardProps = {
	provider: ApiKeyProviderMeta;
	isConfigured: boolean;
	defaultValue: string;
	onSave: (apiKey: string) => void;
};

type ConnectionStatus = {
	valid: boolean;
	message: string;
};

export function ApiKeyProviderCard({
	defaultValue,
	provider,
	isConfigured,
	onSave,
}: ApiKeyProviderCardProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [isChecking, setIsChecking] = useState(false);
	const [connectionStatus, setConnectionStatus] =
		useState<ConnectionStatus | null>(null);
	const prevValueRef = useRef(defaultValue);
	const Icon = provider.icon;
	const canSave = internalValue !== defaultValue;

	// When the passed value changes, update the internal value
	if (defaultValue !== prevValueRef.current) {
		prevValueRef.current = defaultValue;
		setInternalValue(defaultValue);
	}

	const handleSave = async () => {
		if (!canSave) return;
		onSave(internalValue);
	};

	const handleCheckConnection = async () => {
		if (isChecking) return;

		setIsChecking(true);

		try {
			const response = await validateApiKey({
				provider: provider.id,
				apiKey: internalValue,
			});

			if (!response.success) {
				setConnectionStatus({
					valid: false,
					message: response.errorMessage ?? "Failed to check connection",
				});
				return;
			}

			// Set the connection status based on the response
			const { valid, message } = response.data;
			if (valid) {
				setConnectionStatus({
					valid: true,
					message: "Connection successful",
				});
				return;
			}
			setConnectionStatus({
				valid: false,
				message: message ?? "Connection failed",
			});
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-card p-4",
				"transition-colors hover:border-border/80",
			)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-md",
						"text-foreground",
					)}
				>
					<Icon className="size-6" />
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="text-sm font-medium leading-none">
							{provider.name}
						</h3>
						<StatusBadge isConfigured={isConfigured} />
					</div>
					<p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
						{provider.description}
					</p>
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-2.5">
				<ApiKeySecretInput
					value={internalValue}
					placeholder={provider.placeholder}
					onChange={(value) => setInternalValue(value.trim())}
					onSubmit={handleSave}
				/>

				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outline"
						disabled={!isConfigured || isChecking}
						onClick={handleCheckConnection}
						className="px-4"
					>
						{isChecking && <Loader2Icon className="animate-spin" />}
						Check connection
					</Button>
					<Button disabled={!canSave} onClick={handleSave} className="px-5">
						Save
					</Button>
				</div>

				{connectionStatus && (
					<ConnectionStatusBox
						valid={connectionStatus.valid}
						message={connectionStatus.message}
						onDismiss={() => setConnectionStatus(null)}
					/>
				)}
			</div>
		</div>
	);
}

type StatusBadgeProps = {
	isConfigured: boolean;
};
function StatusBadge({ isConfigured }: StatusBadgeProps) {
	if (isConfigured) {
		return (
			<span
				className={cn(
					"rounded-sm bg-primary",
					"px-1.5 py-0.5 text-[10px] font-medium leading-none",
				)}
			>
				Configured
			</span>
		);
	}

	return (
		<span
			className={cn(
				"rounded-sm bg-secondary border border-border",
				"px-1.5 py-0.5 text-[10px] font-medium leading-none",
			)}
		>
			Not set
		</span>
	);
}

type ConnectionStatusBoxProps = {
	valid: boolean;
	message: string;
	onDismiss: () => void;
};

function ConnectionStatusBox({
	valid,
	message,
	onDismiss,
}: ConnectionStatusBoxProps) {
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
				valid
					? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
					: "border-destructive/30 bg-destructive/10 text-destructive",
			)}
		>
			<p className="min-w-0 flex-1 leading-relaxed">{message}</p>
			<IconButton
				size="icon-xs"
				aria-label="Dismiss"
				onClick={onDismiss}
				className={cn("shrink-0 hover:stroke-white hover:bg-transparent")}
			>
				<XIcon />
			</IconButton>
		</div>
	);
}
