import { Input } from "@/components/react/ui";
import { cn } from "@/lib/utils";
import { searchInputStyles } from "@/utils/helpers";

interface SearchInputProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isSearching: boolean;
	placeholder?: string;
	className?: string;
}

export function SearchInput({
	value,
	onChange,
	isSearching,
	placeholder = "Search posts by title, description, or tags...",
	className,
}: SearchInputProps) {
	return (
		<div className={cn("relative w-full max-w-2xl", className)}>
			<style>{searchInputStyles}</style>
			<div className="relative">
				<Input
					type="search"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className="pr-8"
				/>
				{isSearching && (
					<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
					</div>
				)}
			</div>
		</div>
	);
}
