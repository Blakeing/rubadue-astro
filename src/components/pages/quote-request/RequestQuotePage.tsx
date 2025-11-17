import { QuoteRequestForm } from "@/components/forms/quote-request/QuoteRequestForm";

import { useEffect, useState } from "react";

interface RequestQuotePageProps {
	className?: string;
}

export function RequestQuotePage({}: RequestQuotePageProps) {
	const [initialValues, setInitialValues] = useState<{ 
		partNumber?: string;
		wireTypes?: {
			litzWire: boolean;
			windingWire: boolean;
			customCable: boolean;
		};
	} | undefined>(undefined);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		// Get parameters from URL
		const urlParams = new URLSearchParams(window.location.search);
		const partNumberParam = urlParams.get("partNumber");
		const wireTypeParam = urlParams.get("wireType");
		
		const values: typeof initialValues = {};
		
		if (partNumberParam) {
			values.partNumber = partNumberParam;
		}
		
		if (wireTypeParam) {
			values.wireTypes = {
				litzWire: wireTypeParam === "litzWire",
				windingWire: wireTypeParam === "windingWire",
				customCable: false,
			};
		} else {
			// Ensure wireTypes is always defined with all required boolean properties
			values.wireTypes = {
				litzWire: false,
				windingWire: false,
				customCable: false,
			};
		}
		
		setInitialValues(Object.keys(values).length > 0 ? values : undefined);
		setIsInitialized(true);
	}, []);

	// Don't render the form until we've processed URL parameters
	if (!isInitialized) {
		return (
			<div className="isolate relative">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
					<div className="animate-pulse">
						<div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
						<div className="space-y-4">
							<div className="h-4 bg-gray-200 rounded w-full"></div>
							<div className="h-4 bg-gray-200 rounded w-5/6"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const handleFormSuccess = () => {
		// Clear URL parameters after successful submission
		const url = new URL(window.location.href);
		url.searchParams.delete("partNumber");
		url.searchParams.delete("wireType");
		
		// Update the URL without reloading the page
		window.history.replaceState({}, "", url.toString());
		
		// Clear the initial values for future loads
		setInitialValues(undefined);
	};

	return (
		<div className="isolate relative">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
				<p className="text-base sm:text-lg mb-6">
					Please fill out the form below and we'll get back to you as soon as
					possible with a quote for your wire and cable needs.
				</p>
				<QuoteRequestForm 
					initialValues={initialValues}
					onSuccess={handleFormSuccess}
				/>
			</div>
		</div>
	);
}
