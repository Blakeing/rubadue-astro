import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
} from "@/components/ui";
import { ContactUsCTA } from "@/components/ui/ContactUsCTA";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { EXAMPLE_PART_NUMBERS } from "./utils";

interface PartNumberDisplayProps {
	partNumber: string;
	className?: string;
	wireType?: "litzWire" | "windingWire";
}

export function PartNumberDisplay({
	partNumber,
	className,
	wireType,
}: PartNumberDisplayProps) {
	const handleRequestQuote = () => {
		if (!partNumber) return;

		// Navigate to quote request page with part number and wire type as URL parameters
		const params = new URLSearchParams();
		params.set('partNumber', partNumber);
		if (wireType) {
			params.set('wireType', wireType);
		}
		const url = `/request-a-quote?${params.toString()}`;
		window.location.href = url;
	};

	return (
		<div className={cn("sticky top-[120px] h-fit", className)}>
			<Card>
				<CardHeader>
					<CardTitle>Example Part Numbers</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					{EXAMPLE_PART_NUMBERS.map((example) => (
						<div key={example.id}>
							<div className="font-medium font-mono tracking-wider mb-2">
								{example.number}
							</div>
							<p className="text-sm text-muted-foreground">
								{example.description}
							</p>
						</div>
					))}
				</CardContent>
			</Card>
			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Generated Part Number</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<Input
								value={partNumber}
								readOnly
								className="font-mono text-xl w-full"
								placeholder="Part number"
								aria-label="Generated part number"
							/>
							<Button
								variant="default"
								size="sm"
								className="gap-2 whitespace-nowrap"
								onClick={handleRequestQuote}
								disabled={!partNumber}
								aria-label={
									partNumber ? "Request a quote for this part number" : "No part number to quote"
								}
							>
								<ExternalLink className="h-4 w-4" />
								Request a Quote
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			
			<ContactUsCTA className="mt-6" />
		</div>
	);
}
