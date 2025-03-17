import { Card, CardContent, CardHeader } from "@/components/react/ui";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/helpers";
import type { Post } from "@/utils/types";

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
				<CardHeader className="p-0">
					{post.data.heroImage && (
						<div className="relative aspect-video">
							<img
								src={post.data.heroImage}
								alt=""
								width={720}
								height={360}
								className="object-cover absolute inset-0 w-full h-full"
							/>
						</div>
					)}
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tighter mb-2 group-hover:text-primary transition-colors line-clamp-2">
						{post.data.title}
					</h2>
					<div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
						{post.data.tags?.map((tag) => (
							<span
								key={tag}
								className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-muted"
							>
								{tag}
							</span>
						))}
					</div>
					<p className="text-xs sm:text-sm text-muted-foreground">
						{formatDate(post.data.pubDate)}
					</p>
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
