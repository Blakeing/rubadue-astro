import { cn } from "@/lib/utils";
import { PostCard } from "./components/post/PostCard";
import { SearchInput } from "./components/SearchInput";
import { SearchPagination } from "./components/SearchPagination";
import { TagList } from "./components/TagList";
import { useSearch } from "./hooks/useSearch";
import type { SearchProps } from "./utils/types";
import { Card } from "@/components/react/ui";

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
		<div className={cn("w-full min-h-[calc(100vh-452px)]", className)}>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
				{/* Main Content */}
				<div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
					{hasResults ? (
						<div className="grid gap-6">
							{currentPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="text-center py-12 text-muted-foreground">
							<p className="text-lg font-medium">
								No results found{selectedTag ? ` for tag "${selectedTag}"` : ""}
								.
							</p>
							<p className="mt-2">Try adjusting your search criteria.</p>
						</div>
					)}

					{hasResults && (
						<SearchPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					)}
				</div>

				{/* Sidebar */}
				<aside className="lg:col-span-4 mt-6 lg:mt-0 order-1 lg:order-2">
					<div className="lg:sticky lg:top-40 space-y-4 sm:space-y-6">
						<Card>
							<div className="p-4 sm:p-6">
								<SearchInput
									value={searchQuery}
									onChange={handleSearch}
									isSearching={isSearching}
									placeholder="Search knowledge base..."
								/>
							</div>
						</Card>

						<Card>
							<div className="p-4 sm:p-6">
								<h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
									Categories
								</h2>
								<TagList
									tags={allTags}
									selectedTag={selectedTag}
									onTagClick={handleTagClick}
								/>
							</div>
						</Card>
					</div>
				</aside>
			</div>
		</div>
	);
}
