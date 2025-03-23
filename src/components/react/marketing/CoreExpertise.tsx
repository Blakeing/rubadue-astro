import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import React from "react";

// Service through Partnership list items
const partnershipItems = [
	"Responsive Customer Service with Dedicated Account Managers",
	"Easy Access to Real-Time Stock Availability",
	"Long-term Supply Agreements & Dedicated Production Available",
	"Customized Stocking Agreements Tailored to Your Needs",
	"Flexible Shipment Schedules",
];

// Engineering Support list items
const engineeringItems = [
	"Direct Access to Design Engineers",
	"Rapid Prototyping Assistance",
	"Complimentary or Low-Cost Sample Support",
	"Design Solutions Tailored to Your Needs",
	"DFx Support from R&D to Product Launch",
	"Comprehensive Documentation and Design Controls Aligned with Industry and Customer Standards",
	"Assistance with Safety Agency Certifications and Approval",
	"Litz & TIW Design Lunch & Learn Sessions for Engineering & Supply Chain Teams",
];

// Quality Product list items
const qualityItems = [
	"Quality System Designed to Exceed ISO and Industry Standards",
	"Robust Production and Quality Controls Ensuring Consistency Across All Production Lots",
	"Full Material Traceability to Support Customer Quality and Sourcing Requirements",
	"Dedicated QA Support",
	"Flexible Manufacturing Support from R&D through Full Scale Production",
];

export default function CoreExpertise() {
	return (
		<section className="py-12 sm:py-16 md:py-24 bg-foreground/95">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:mx-0">
					<h2 className="text-xl font-display text-muted">
						Core <span className="text-primary">Expertise</span>
					</h2>
					<p className="mt-2 text-pretty text-3xl font-semibold tracking-tight text-background sm:text-4xl lg:text-5xl">
						Customer Success
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mt-8 sm:mt-12">
					{/* Service through Partnership */}
					<Card className="h-full">
						<CardHeader className="flex flex-row items-center gap-4">
							<CardTitle className="text-lg sm:text-xl">
								<span className="text-primary">Partnership</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 sm:space-y-3">
								{partnershipItems.map((item) => (
									<li
										key={`partnership-${item.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-primary mr-2">•</span>
										<span className="text-muted-foreground text-sm sm:text-base">
											{item}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Provide Proven Engineering Support */}
					<Card className="h-full">
						<CardHeader className="flex flex-row items-center gap-4">
							<CardTitle className="text-lg sm:text-xl">
								<span className="text-primary">Engineering Support</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 sm:space-y-3">
								{engineeringItems.map((item) => (
									<li
										key={`engineering-${item.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-primary mr-2">•</span>
										<span className="text-muted-foreground text-sm sm:text-base">
											{item}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					{/* Continuing to Produce the Highest Quality Product */}
					<Card className="h-full sm:col-span-2 lg:col-span-1">
						<CardHeader className="flex flex-row items-center gap-4">
							<CardTitle className="text-lg sm:text-xl">
								<span className="text-primary">Highest Quality Product</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 sm:space-y-3">
								{qualityItems.map((item) => (
									<li
										key={`quality-${item.substring(0, 20)}`}
										className="flex items-start"
									>
										<span className="text-primary mr-2">•</span>
										<span className="text-muted-foreground text-sm sm:text-base">
											{item}
										</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
