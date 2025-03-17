import { cn } from "@/lib/utils";
import { PostCard } from "./components/PostCard";
import { SearchInput } from "./components/SearchInput";
import { SearchPagination } from "./components/SearchPagination";
import { TagList } from "./components/TagList";
import { useSearch } from "./hooks/useSearch";
import type { SearchProps } from "./utils/types";

export function Search({ posts, className }: SearchProps) {
	const {
		searchQuery,
		isSearching,
		selectedTag,
		currentPage,
		allTags,
		currentPosts,
		totalPages,
		handleSearch,
		handleTagClick,
		handlePageChange,
	} = useSearch({ posts });

	const hasResults = currentPosts.length > 0;

	return (
		<div
			className={cn("w-full space-y-6 min-h-[calc(100vh-452px)]", className)}
		>
			<div className="space-y-4">
				<SearchInput
					value={searchQuery}
					onChange={handleSearch}
					isSearching={isSearching}
					placeholder="Search by title, description, or tags..."
				/>

				<TagList
					tags={allTags}
					selectedTag={selectedTag}
					onTagClick={handleTagClick}
				/>

				{hasResults ? (
					<div className="grid gap-6 sm:grid-cols-2">
						{currentPosts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				) : (
					<div className="text-center py-8 text-muted-foreground">
						<p>
							No results found{selectedTag ? ` for tag "${selectedTag}"` : ""}.
						</p>
						<p className="mt-2">Try adjusting your search criteria.</p>
					</div>
				)}

				<SearchPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
