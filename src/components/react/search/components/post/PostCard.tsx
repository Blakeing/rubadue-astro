import { formatDate } from "@/components/react/search/utils/helpers";
import { Card, CardContent } from "@/components/react/ui";
import { cn } from "@/lib/utils";
import type { Post } from "@/components/react/search/utils/types";

interface PostCardProps {
	post: Post;
	className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
	return (
		<a
			href={`/knowledge-base/${post.id.replace(/\.md$/, "")}/`}
			className={cn("group", className)}
		>
			<Card className="overflow-hidden transition-colors hover:border-primary h-full">
				<CardContent className="p-4 sm:p-6">
					<p className="text-xs font-display tracking-wider text-primary/80 mb-2">
						{formatDate(post.data.pubDate)}
					</p>
					<h2 className="text-xl text-pretty sm:text-2xl font-semibold leading-tight tracking-tighter mb-2  transition-colors line-clamp-2">
						{post.data.title}
					</h2>
					{post.data.description && (
						<p className="text-sm text-muted-foreground mt-2 line-clamp-2">
							{post.data.description}
						</p>
					)}
				</CardContent>
			</Card>
		</a>
	);
}
