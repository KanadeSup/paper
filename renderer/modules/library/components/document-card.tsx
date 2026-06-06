import { cn } from "@renderer/modules/design-system/lib/utils";

export type DocumentCardProps = {
	title: string;
	totalPages?: number;
	author?: string;
	thumbnail?: string;
};

export function DocumentCard(props: DocumentCardProps) {
	const { title, totalPages, author, thumbnail } = props;

	return (
		<div
			className={cn(
				"flex flex-col gap-2 cursor-pointer",
				"hover:translate-y-[-4px] transition-transform duration-300",
			)}
		>
			<div className="w-full h-64 bg-accent rounded-lg">
				{thumbnail && (
					<img
						src={thumbnail}
						alt={title}
						className="w-full h-full object-cover"
					/>
				)}
			</div>
			<div>
				<h3 className="font-medium truncate">{title}</h3>
				<div className="flex items-center justify-between gap-2">
					<p className="text-sm text-muted-foreground truncate">{author}</p>
					<p className="shrink-0 text-sm text-muted-foreground/80">
						[{totalPages} pages]
					</p>
				</div>
			</div>
		</div>
	);
}
