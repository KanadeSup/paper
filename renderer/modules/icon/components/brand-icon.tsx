import { cn } from "@renderer/modules/design-system";
import type { IconProps } from "../types/icon.type";

export function OpenAIIcon(iconProps: IconProps) {
	const { className, size, color } = iconProps;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size ?? 24}
			height={size ?? 24}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color ?? "currentColor"}
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={cn(
				"icon icon-tabler icons-tabler-outline icon-tabler-brand-openai",
				className,
			)}
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M11.217 19.384a3.501 3.501 0 0 0 6.783 -1.217v-5.167l-6 -3.35" />
			<path d="M5.214 15.014a3.501 3.501 0 0 0 4.446 5.266l4.34 -2.534v-6.946" />
			<path d="M6 7.63c-1.391 -.236 -2.787 .395 -3.534 1.689a3.474 3.474 0 0 0 1.271 4.745l4.263 2.514l6 -3.348" />
			<path d="M12.783 4.616a3.501 3.501 0 0 0 -6.783 1.217v5.067l6 3.45" />
			<path d="M18.786 8.986a3.501 3.501 0 0 0 -4.446 -5.266l-4.34 2.534v6.946" />
			<path d="M18 16.302c1.391 .236 2.787 -.395 3.534 -1.689a3.474 3.474 0 0 0 -1.271 -4.745l-4.308 -2.514l-5.955 3.42" />
		</svg>
	);
}

export function GrokIcon(iconProps: IconProps) {
	const { className, size, color } = iconProps;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill={color ?? "currentColor"}
			fill-rule="evenodd"
			className={cn(className)}
			viewBox="0 0 24 24"
			width={size ?? 24}
			height={size ?? 24}
		>
			<title>Grok</title>
			<path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
		</svg>
	);
}

export function GeminiIcon(iconProps: IconProps) {
	const { className, size } = iconProps;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height={size ?? 24}
			viewBox="0 0 24 24"
			width={size ?? 24}
			className={cn(className)}
		>
			<title>Gemini</title>
			<path
				d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
				fill="#3186FF"
			/>
			<path
				d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
				fill="url(#lobe-icons-gemini-0-_R_0_)"
			/>
			<path
				d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
				fill="url(#lobe-icons-gemini-1-_R_0_)"
			/>
			<path
				d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
				fill="url(#lobe-icons-gemini-2-_R_0_)"
			/>
			<defs>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="lobe-icons-gemini-0-_R_0_"
					x1="7"
					x2="11"
					y1="15.5"
					y2="12"
				>
					<stop stop-color="#08B962" />
					<stop offset="1" stop-color="#08B962" stop-opacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="lobe-icons-gemini-1-_R_0_"
					x1="8"
					x2="11.5"
					y1="5.5"
					y2="11"
				>
					<stop stop-color="#F94543" />
					<stop offset="1" stop-color="#F94543" stop-opacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="lobe-icons-gemini-2-_R_0_"
					x1="3.5"
					x2="17.5"
					y1="13.5"
					y2="12"
				>
					<stop stop-color="#FABC12" />
					<stop offset=".46" stop-color="#FABC12" stop-opacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}
