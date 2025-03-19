import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "@/components/react/ui/card";
import { QuoteRequestForm } from "@/components/react/forms/quote-request/QuoteRequestForm";

interface RequestQuotePageProps {
	className?: string;
}

export function RequestQuotePage({ className }: RequestQuotePageProps) {
	return (
		<div className="isolate relative">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
				<Card className="shadow-lg">
					<CardHeader className="space-y-2 pb-4 sm:pb-6">
						<CardDescription className="text-base sm:text-lg">
							Please fill out the form below and we'll get back to you as soon
							as possible with a quote for your wire and cable needs.
						</CardDescription>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 lg:p-8">
						<QuoteRequestForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
