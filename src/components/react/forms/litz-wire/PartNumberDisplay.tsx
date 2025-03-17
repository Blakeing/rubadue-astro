import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import { cn } from "@/lib/utils";

interface PartNumberDisplayProps {
	partNumber: string;
	className?: string;
}

export function PartNumberDisplay({
	partNumber,
	className,
}: PartNumberDisplayProps) {
	return (
		<Card className={cn("h-fit", className)}>
			<CardHeader>
				<CardTitle>Generated Part Number</CardTitle>
				<CardDescription>
					Your custom part number will appear here as you fill out the form
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-muted rounded-lg">
					<p
						className={cn(
							"text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-center",
							!partNumber && "text-muted-foreground",
						)}
					>
						{partNumber || "LXXXXXXXXXX"}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
