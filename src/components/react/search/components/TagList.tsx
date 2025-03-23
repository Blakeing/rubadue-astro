import { cn } from "@/lib/utils";

interface TagListProps {
	tags: string[];
	selectedTag: string | null;
	onTagClick: (tag: string) => void;
	className?: string;
}

export function TagList({
	tags,
	selectedTag,
	onTagClick,
	className,
}: TagListProps) {
	if (!tags.length) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{tags.map((tag) => (
				<button
					type="button"
					key={tag}
					onClick={() => onTagClick(tag)}
					className={cn(
						"text-sm px-3 py-1 rounded-full transition-colors",
						selectedTag === tag
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80",
					)}
				>
					{tag}
				</button>
			))}
		</div>
	);
}
