export type SettingLayoutProps = {
	children: React.ReactNode;
};

export function SettingLayout(props: SettingLayoutProps) {
	const { children } = props;
	return <div className="flex flex-col gap-4 p-3 w-full">{children}</div>;
}

export type SettingTitleProps = {
	title: string;
};

export function SettingTitle(props: SettingTitleProps) {
	const { title } = props;
	return (
		<div>
			<h1 className="font-semibold">{title}</h1>
		</div>
	);
}
