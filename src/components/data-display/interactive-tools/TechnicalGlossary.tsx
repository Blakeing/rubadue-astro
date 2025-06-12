import { Badge, Button, Card, CardContent, Input } from "@/components/ui";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

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
		<div className="sticky top-[60px] md:top-[92px] lg:top-[132px] z-10 bg-background/80 backdrop-blur-sm mb-6">
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
	const [rootMarginTopOffset, setRootMarginTopOffset] = useState(0);

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

	// Calculate and update root margin offset on resize
	useEffect(() => {
		const calculateOffset = () => {
			// Only run this code on the client side
			if (typeof window === "undefined") {
				return 173; // Default to mobile offset SSR
			}

			const screenWidth = window.innerWidth;
			const stickyNavHeight = 113; // Estimated height of the sticky search/nav bar

			if (screenWidth >= 1024) {
				// Desktop: lg breakpoint (1024px) - Header 132px
				return 132 + stickyNavHeight; // 245px
			}
			if (screenWidth >= 768) {
				// Tablet: md breakpoint (768px) - Header 92px
				return 92 + stickyNavHeight; // 205px
			}
			// Mobile: < md breakpoint - Header 60px
			return 60 + stickyNavHeight; // 173px
		};

		const handleResize = () => {
			setRootMarginTopOffset(calculateOffset());
		};

		// Set initial offset
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Keep ref in sync with state
	useEffect(() => {
		currentActiveSectionRef.current = currentActiveSection;
	}, [currentActiveSection]);

	// Setup intersection observer
	useEffect(() => {
		// Ensure offset is calculated before setting up observer
		if (rootMarginTopOffset === 0) return;

		const sectionIntersections = new Map<string, number>();

		// Disconnect previous observer if it exists
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

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
				// Use dynamic top margin based on calculated offset, keep bottom margin percentage
				rootMargin: `-${rootMarginTopOffset}px 0px -30% 0px`,
			},
		);

		// Observe elements immediately after observer setup
		const currentObserver = observerRef.current;
		requestAnimationFrame(() => {
			for (const element of Object.values(sectionRefs.current)) {
				if (element) {
					currentObserver?.observe(element);
				}
			}
		});

		return () => {
			if (currentObserver) {
				currentObserver.disconnect();
			}
		};
	}, [rootMarginTopOffset]);

	// Update observed elements when displayed sections change
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Reset current active section when filter changes
		setCurrentActiveSection(null);
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
			// Calculate offset based on viewport width
			const screenWidth = window.innerWidth;
			let offset: number;
			const stickyNavHeight = 113; // Estimated height of the sticky search/nav bar

			if (screenWidth >= 1024) {
				// Desktop: lg breakpoint (1024px) - Header 132px
				offset = 132 + stickyNavHeight; // 245px
			} else if (screenWidth >= 768) {
				// Tablet: md breakpoint (768px) - Header 92px
				offset = 92 + stickyNavHeight; // 205px
			} else {
				// Mobile: < md breakpoint - Header 60px
				offset = 60 + stickyNavHeight; // 173px
			}

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
						// Responsive scroll margin top: Mobile 173px, Tablet 205px, Desktop 245px
						"glossary-section scroll-mt-[173px] md:scroll-mt-[205px] lg:scroll-mt-[245px]",
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
