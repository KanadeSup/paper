import { cn } from "../../lib/utils";

export type SkeletonProps = React.ComponentProps<"div">;
export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn(
				"skeleton-shimmer relative overflow-hidden bg-slate-200/80 dark:bg-input/50",
				className,
			)}
			{...props}
		>
			<style>{`
          @keyframes skeleton-wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .skeleton-shimmer::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.55) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: skeleton-wave 1.5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .skeleton-shimmer::after { animation: none; }
          }
          .dark .skeleton-shimmer::after {
            background-image: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.12) 50%,
              rgba(255, 255, 255, 0) 100%
            );
          }
        `}</style>
		</div>
	);
}
