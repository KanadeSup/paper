import {
	SettingLayout,
	SettingTitle,
} from "../setting/components/setting-layout";

export function SettingApiKeyPage() {
	return (
		<SettingLayout>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<SettingTitle title="API Keys" />
				</div>
			</div>
		</SettingLayout>
	);
}
