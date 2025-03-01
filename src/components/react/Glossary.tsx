import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/react/ui/input";
import { ScrollArea } from "@/components/react/ui/scroll-area";
import { Card, CardContent } from "@/components/react/ui/card";
import { Badge } from "@/components/react/ui/badge";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/react/ui/button";

interface GlossaryTerm {
	term: string;
	definition: string;
}

interface GlossarySection {
	letter: string;
	terms: GlossaryTerm[];
}

interface GlossaryProps {
	glossaryTerms: Record<string, GlossaryTerm[]>;
}

// Helper function to highlight text
function HighlightedText({
	text,
	searchTerm,
}: { text: string; searchTerm: string }) {
	if (!searchTerm.trim()) return <>{text}</>;

	const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
	return (
		<>
			{parts.map((part, i) =>
				part.toLowerCase() === searchTerm.toLowerCase() ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<span key={i} className="bg-yellow-200 rounded px-0.5">
						{part}
					</span>
				) : (
					part
				),
			)}
		</>
	);
}

// Move SearchAndNavigation outside main component to prevent re-renders
function SearchAndNavigation({
	searchTerm,
	onSearchChange,
	allSections,
	displayedSections,
	currentActiveSection,
	onSectionClick,
}: {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	allSections: GlossarySection[];
	displayedSections: GlossarySection[];
	currentActiveSection: string | null;
	onSectionClick: (letter: string) => void;
}) {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const activeBadgeRef = useRef<HTMLDivElement>(null);

	// Add keyboard shortcut for search
	useEffect(() => {
		// Only run this code on the client side
		if (typeof window === "undefined" || typeof document === "undefined") {
			return;
		}

		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyPress);
		return () => document.removeEventListener("keydown", handleKeyPress);
	}, []);

	// Scroll active badge into view
	useEffect(() => {
		if (
			currentActiveSection &&
			scrollContainerRef.current &&
			activeBadgeRef.current
		) {
			activeBadgeRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "center",
			});
		}
	}, [currentActiveSection]);

	return (
		<div className="sticky top-[5.5rem] z-10 bg-background/80 backdrop-blur-sm mb-6">
			<div className="relative py-3">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					ref={searchInputRef}
					placeholder="Search glossary..."
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className={cn("w-full pl-9", searchTerm && "pr-8")}
				/>
				{searchTerm && (
					<Button
						variant="ghost"
						size="sm"
						className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
						onClick={() => {
							onSearchChange("");
							searchInputRef.current?.focus();
						}}
					>
						<X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
						<span className="sr-only">Clear search</span>
					</Button>
				)}
			</div>
			<div className="border-t">
				<div
					ref={scrollContainerRef}
					className="overflow-x-auto scrollbar-none"
				>
					<div className="flex gap-2 py-3">
						{allSections.map((section) => {
							const filteredTermCount =
								displayedSections.find((s) => s.letter === section.letter)
									?.terms.length || 0;

							if (searchTerm && filteredTermCount === 0) return null;

							return (
								<div
									key={section.letter}
									ref={
										currentActiveSection === section.letter
											? activeBadgeRef
											: null
									}
								>
									<Badge
										variant={
											currentActiveSection === section.letter
												? "default"
												: "outline"
										}
										className="cursor-pointer hover:bg-accent shrink-0"
										onClick={() => onSectionClick(section.letter)}
									>
										{section.letter}
										<span className="ml-1 text-xs">
											({filteredTermCount || section.terms.length})
										</span>
									</Badge>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export function GlossaryComponent({ glossaryTerms }: GlossaryProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [allSections, setAllSections] = useState<GlossarySection[]>([]);
	const [displayedSections, setDisplayedSections] = useState<GlossarySection[]>(
		[],
	);
	const [currentActiveSection, setCurrentActiveSection] = useState<
		string | null
	>(null);

	const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const observerRef = useRef<IntersectionObserver | null>(null);
	const currentActiveSectionRef = useRef<string | null>(null);

	// Initialize sections on mount and handle search term changes
	useEffect(() => {
		const sections = Object.entries(glossaryTerms).map(([letter, terms]) => ({
			letter,
			terms,
		}));
		setAllSections(sections);
		filterGlossary(searchTerm, sections);
	}, [glossaryTerms, searchTerm]);

	// Keep ref in sync with state
	useEffect(() => {
		currentActiveSectionRef.current = currentActiveSection;
	}, [currentActiveSection]);

	// Setup intersection observer
	useEffect(() => {
		const sectionIntersections = new Map<string, number>();

		observerRef.current = new IntersectionObserver(
			(entries) => {
				// Update intersection ratios for all entries
				for (const entry of entries) {
					const sectionId = entry.target.id;
					const letter = sectionId.split("-")[1];
					if (letter) {
						sectionIntersections.set(letter, entry.intersectionRatio);
					}
				}

				// Find the section with the highest intersection ratio
				let maxRatio = 0;
				let mostVisibleSection: string | null = null;

				for (const [letter, ratio] of sectionIntersections) {
					if (ratio > maxRatio) {
						maxRatio = ratio;
						mostVisibleSection = letter;
					}
				}

				// Only update if we have a visible section and it's different
				if (
					mostVisibleSection &&
					mostVisibleSection !== currentActiveSectionRef.current
				) {
					setCurrentActiveSection(mostVisibleSection);
				}
			},
			{
				threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
				rootMargin: "-20% 0px -60% 0px",
			},
		);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	// Update observed elements when sections change
	// biome-ignore lint/correctness/useExhaustiveDependencies: displayedSections is needed to re-observe elements after filtering
	useEffect(() => {
		if (!observerRef.current) return;

		// Reset current active section
		setCurrentActiveSection(null);

		// Disconnect from all previous observations
		observerRef.current.disconnect();

		// Observe all current section refs
		requestAnimationFrame(() => {
			for (const element of Object.values(sectionRefs.current)) {
				if (element) {
					observerRef.current?.observe(element);
				}
			}
		});
	}, [displayedSections]);

	const filterGlossary = (search: string, sections: GlossarySection[]) => {
		const filtered = sections
			.map(({ letter, terms }) => ({
				letter,
				terms: terms.filter(
					(term) =>
						term.term.toLowerCase().includes(search.toLowerCase()) ||
						term.definition.toLowerCase().includes(search.toLowerCase()),
				),
			}))
			.filter((section) => section.terms.length > 0);

		setDisplayedSections(filtered);
	};

	const scrollToSection = (letter: string) => {
		// Only run this code on the client side
		if (typeof window === "undefined") {
			return;
		}

		const element = sectionRefs.current[letter];
		if (element) {
			// Calculate offset for header (88px) and search bar (approximately 140px)
			const offset = 228;
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	};

	const renderContent = () => {
		return displayedSections.map((section, index) => {
			const { letter, terms } = section;

			return (
				<div
					key={letter}
					id={`section-${letter}`}
					ref={(el) => {
						sectionRefs.current[letter] = el;
					}}
					className={cn(
						"glossary-section scroll-mt-[199px]",
						index === 0 && "first-visible-section",
					)}
				>
					<h2 className="text-3xl font-bold mb-6">{letter}</h2>
					<div className="space-y-4">
						{terms.map((item) => (
							<Card key={`${letter}-${item.term}`}>
								<CardContent className="pt-6">
									<h3 className="text-lg font-semibold text-primary mb-2">
										<HighlightedText text={item.term} searchTerm={searchTerm} />
									</h3>
									<p className="text-muted-foreground">
										<HighlightedText
											text={item.definition}
											searchTerm={searchTerm}
										/>
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			);
		});
	};

	return (
		<div className="space-y-6">
			<SearchAndNavigation
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				allSections={allSections}
				displayedSections={displayedSections}
				currentActiveSection={currentActiveSection}
				onSectionClick={scrollToSection}
			/>
			<div className="space-y-8">{renderContent()}</div>
		</div>
	);
}
