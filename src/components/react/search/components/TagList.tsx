import { cn } from "@/lib/utils";

interface TagListProps {
	tags: string[];
	selectedTag: string | null;
	onTagClick: (tag: string) => void;
}

export function TagList({ tags, selectedTag, onTagClick }: TagListProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<button
					type="button"
					key={tag}
					onClick={() => onTagClick(tag)}
					className={cn(
						"inline-flex items-center rounded-full bg-muted px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors",
						selectedTag === tag
							? "bg-primary text-primary-foreground"
							: "hover:bg-primary hover:text-primary-foreground",
					)}
				>
					{tag}
				</button>
			))}
		</div>
	);
}
