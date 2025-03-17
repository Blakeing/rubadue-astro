import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/react/ui";

interface SearchPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function SearchPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: SearchPaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<Pagination className={cn("justify-center", className)}>
			<PaginationContent>
				{currentPage > 1 && (
					<PaginationItem>
						<PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
					</PaginationItem>
				)}
				{Array.from({ length: totalPages }).map((_, i) => {
					const page = i + 1;
					const isCurrentPage = page === currentPage;
					const isFirstPage = page === 1;
					const isLastPage = page === totalPages;
					const isWithinTwoPages = Math.abs(page - currentPage) <= 1;

					if (!isFirstPage && !isLastPage && !isWithinTwoPages) {
						if (page === 2 || page === totalPages - 1) {
							return (
								<PaginationItem key={page}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						}
						return null;
					}

					return (
						<PaginationItem key={page}>
							<PaginationLink
								onClick={() => onPageChange(page)}
								isActive={isCurrentPage}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					);
				})}
				{currentPage < totalPages && (
					<PaginationItem>
						<PaginationNext onClick={() => onPageChange(currentPage + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
}
