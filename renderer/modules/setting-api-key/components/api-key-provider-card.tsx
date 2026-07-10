import { Button, cn } from "@renderer/modules/design-system";
import { useRef, useState } from "react";
import type { ApiKeyProviderMeta } from "../constants/providers";
import { ApiKeySecretInput } from "./api-key-secret-input";

export type ApiKeyProviderCardProps = {
	provider: ApiKeyProviderMeta;
	isConfigured: boolean;
	defaultValue: string;
	onSave: (apiKey: string) => void;
};

export function ApiKeyProviderCard({
	defaultValue,
	provider,
	isConfigured,
	onSave,
}: ApiKeyProviderCardProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const prevValueRef = useRef(defaultValue);
	const Icon = provider.icon;
	const canSave = internalValue.trim().length !== defaultValue.trim().length;

	// When the passed value changes, update the internal value
	if (defaultValue !== prevValueRef.current) {
		prevValueRef.current = defaultValue;
		setInternalValue(defaultValue);
	}

	const handleSave = async () => {
		if (!canSave) return;
		onSave(internalValue.trim());
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
					onChange={setInternalValue}
					onSubmit={handleSave}
				/>

				<div className="flex items-center justify-end gap-2">
					<Button disabled={!canSave} onClick={handleSave} className="px-5">
						Save
					</Button>
				</div>
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
