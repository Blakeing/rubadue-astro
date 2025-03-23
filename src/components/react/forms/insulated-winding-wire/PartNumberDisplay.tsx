import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
} from "@/components/react/ui";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { EXAMPLE_PART_NUMBERS } from "./utils";
import { cn } from "@/lib/utils";

interface PartNumberDisplayProps {
	partNumber: string;
	className?: string;
}

export function PartNumberDisplay({
	partNumber,
	className,
}: PartNumberDisplayProps) {
	const handleCopy = async () => {
		if (!partNumber) return;

		try {
			await navigator.clipboard.writeText(partNumber);
			toast.success("Part number copied!", {
				description: "The part number has been copied to your clipboard",
			});
		} catch (error) {
			toast.error("Failed to copy part number", {
				description: "Please try copying manually",
			});
		}
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
								variant="outline"
								size="sm"
								className="gap-2 whitespace-nowrap"
								onClick={handleCopy}
								disabled={!partNumber}
								aria-label={
									partNumber ? "Copy part number" : "No part number to copy"
								}
							>
								<Copy className="h-4 w-4" />
								Copy
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
