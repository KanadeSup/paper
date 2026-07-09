import { cn, IconButton, Input } from "@renderer/modules/design-system";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export type ApiKeySecretInputProps = {
	value: string;
	placeholder?: string;
	onChange: (value: string) => void;
	onSubmit?: () => void;
};

export function ApiKeySecretInput({
	value,
	placeholder,
	onChange,
	onSubmit,
}: ApiKeySecretInputProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="relative">
			<Input
				type={visible ? "text" : "password"}
				value={value}
				placeholder={placeholder}
				autoComplete="off"
				spellCheck={false}
				className={cn("pr-9 font-mono text-[13px] tracking-wide")}
				onChange={(event) => onChange(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						onSubmit?.();
					}
				}}
			/>
			<IconButton
				size="icon-sm"
				className="absolute top-0.5 right-1 text-muted-foreground hover:text-foreground"
				title={visible ? "Hide API key" : "Show API key"}
				onClick={() => setVisible((prev) => !prev)}
			>
				{visible ? (
					<EyeOffIcon className="size-3.5" />
				) : (
					<EyeIcon className="size-3.5" />
				)}
			</IconButton>
		</div>
	);
}
