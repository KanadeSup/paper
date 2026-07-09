import { cn, ScrollArea } from "@renderer/modules/design-system";
import { KeyRoundIcon } from "lucide-react";
import { useState } from "react";
import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";
import { ApiKeyProviderCard } from "./components/api-key-provider-card";
import { API_KEY_PROVIDERS } from "./constants/providers";

export function SettingApiKeyPage() {
	const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
	const handleSaveApiKey = async (provider: string, apiKey: string) => {
		console.log(provider, apiKey);
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
						return (
							<ApiKeyProviderCard
								key={provider.id}
								provider={provider}
								isConfigured={!!apiKeys[provider.id]}
								defaultValue={apiKeys[provider.id] ?? ""}
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
