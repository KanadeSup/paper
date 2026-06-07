import { cn } from "@renderer/modules/design-system";

export type DocumentCardProps = {
	title: string;
	totalPages?: number | null;
	author?: string | null;
	thumbnail?: string | null;
};

export function DocumentCard(props: DocumentCardProps) {
	const { title, totalPages, author, thumbnail } = props;

	return (
		<div
			className={cn(
				"flex min-w-0 flex-col gap-2 cursor-pointer",
				"hover:translate-y-[-4px] transition-transform duration-300",
			)}
		>
			<div className="aspect-3/4 w-full overflow-hidden rounded-lg bg-accent">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={title}
						className="h-full w-full object-cover"
					/>
				) : null}
			</div>
			<div className="min-w-0">
				<h3 className="truncate font-medium">{title}</h3>
				<div className="flex items-center justify-between gap-2">
					{author ? (
						<p className="truncate text-muted-foreground text-sm">{author}</p>
					) : (
						<span />
					)}
					{totalPages != null ? (
						<p className="shrink-0 text-muted-foreground/80 text-sm">
							[{totalPages} pages]
						</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
