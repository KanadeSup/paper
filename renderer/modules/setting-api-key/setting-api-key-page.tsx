import { cn, ScrollArea } from "@renderer/modules/design-system";
import type { ApiKeys } from "@shared/api-key/types/api-key.type";
import { KeyRoundIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";
import { ApiKeyProviderCard } from "./components/api-key-provider-card";
import { API_KEY_PROVIDERS } from "./constants/providers";
import { getApiKeys, setApiKey } from "./ipc/api-key.ipc";

export function SettingApiKeyPage() {
	const [apiKeys, setApiKeys] = useState<ApiKeys>({
		grok: null,
		gemini: null,
		openai: null,
	});

	useEffect(() => {
		async function loadApiKeys() {
			const response = await getApiKeys();

			if (!response.success) {
				toast.error(response.errorMessage ?? "Failed to load API keys");
				return;
			}

			setApiKeys(response.data.apiKeys);
		}

		loadApiKeys();
	}, []);

	const handleSaveApiKey = async (
		provider: (typeof API_KEY_PROVIDERS)[number]["id"],
		apiKey: string,
	) => {
		const response = await setApiKey({ provider, apiKey });

		if (!response.success) {
			toast.error(
				response.errorMessage ?? `Failed to save ${provider} API key`,
			);
			return;
		}

		setApiKeys({
			...apiKeys,
			[provider]: apiKey,
		});
		toast.success(`API key for ${provider} saved`);
	};

	return (
		<SettingLayout>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<SettingTitle title="API Keys" />
					<p className="text-sm text-muted-foreground">
						Connect providers used for chat, selection actions, and RAG. Keys
						stay on this device.
					</p>
				</div>
			</div>

			<ScrollArea className="h-full">
				<div className="flex flex-col gap-3 pr-1">
					{API_KEY_PROVIDERS.map((provider) => {
						const value = apiKeys[provider.id] ?? "";
						return (
							<ApiKeyProviderCard
								key={provider.id}
								provider={provider}
								isConfigured={!!value}
								defaultValue={value}
								onSave={(apiKey) => handleSaveApiKey(provider.id, apiKey)}
							/>
						);
					})}

					<div
						className={cn(
							"flex items-start gap-2.5",
							"rounded-lg border border-dashed border-border/70",
							"bg-muted/20 px-3 py-3",
							"text-xs text-muted-foreground",
						)}
					>
						<KeyRoundIcon className="mt-0.5 size-3.5 shrink-0" />
						<p className="leading-relaxed">
							API keys are stored locally and not exposed to any where else.
						</p>
					</div>
				</div>
			</ScrollArea>
		</SettingLayout>
	);
}
