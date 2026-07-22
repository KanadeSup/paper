import { cn, IconButton } from "@renderer/modules/design-system";
import { BookOpen, PencilIcon } from "lucide-react";

export type DocumentCardProps = {
	title: string;
	totalPages?: number | null;
	author?: string | null;
	thumbnail?: string | null;
	tags?: string[];
	onEditClick?: () => void;
};

export function DocumentCard(props: DocumentCardProps) {
	const {
		title,
		totalPages,
		author,
		thumbnail,
		tags = [],
		onEditClick,
	} = props;

	return (
		<div className="group flex min-w-0 flex-col gap-2.5">
			<div
				className={cn(
					"relative aspect-3/4 w-full overflow-hidden rounded-lg bg-muted",
					"shadow-sm transition-all duration-300 ease-out",
					"group-hover:-translate-y-1",
				)}
			>
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={title}
						loading="lazy"
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
						<BookOpen
							className="size-8 text-muted-foreground/40"
							strokeWidth={1.5}
						/>
					</div>
				)}

				<IconButton
					className={cn(
						"absolute top-1 right-1 z-10",
						"opacity-0 transition-opacity group-hover:opacity-100",
						"bg-black/80 hover:bg-black/90!",
					)}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onEditClick?.();
					}}
				>
					<PencilIcon />
				</IconButton>

				{totalPages != null ? (
					<span
						className={cn(
							"absolute right-1.5 bottom-1.5 rounded-sm bg-black/70 px-1.5 py-0.5",
							"text-[10px] font-medium text-white leading-none",
						)}
					>
						{totalPages} pages
					</span>
				) : null}
			</div>

			<div className="min-w-0 px-0.5">
				<h3
					title={title}
					className="line-clamp-2 font-medium text-foreground text-sm leading-snug transition-colors group-hover:text-primary"
				>
					{title}
				</h3>
				{author ? (
					<p className="mt-1 truncate text-muted-foreground text-xs">
						{author}
					</p>
				) : null}
				{tags.length > 0 ? (
					<ul className="mt-1.5 flex flex-wrap gap-1">
						{tags.map((tag) => (
							<li
								key={tag}
								className={cn(
									"max-w-full truncate rounded-md bg-muted px-1.5 py-0.5",
									"text-[10px] font-medium text-muted-foreground leading-none",
								)}
								title={tag}
							>
								{tag}
							</li>
						))}
					</ul>
				) : null}
			</div>
		</div>
	);
}
