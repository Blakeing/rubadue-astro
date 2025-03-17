import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import React from "react";

// Icons for each expertise area
const PartnershipIcon = () => (
	<svg
		className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<title>Partnership Icon</title>
		<path d="M12 5.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM6.5 9a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0zM2.144 19.9c.123-.7.557-1.286 1.417-1.852.957-.631 2.517-1.142 4.441-1.142 1.927 0 3.486.511 4.443 1.142.86.566 1.294 1.152 1.417 1.852.104.592-.232 1.145-.709 1.235-2.689.506-5.603.506-8.292 0-.477-.09-.813-.643-.709-1.235z" />
		<path d="M15.998 17.006c.079-.095.148-.192.211-.29.913-1.4 1.402-3.228 1.402-5.217 0-3.037-2.463-5.5-5.5-5.5A5.499 5.499 0 007.7 8.395c.099-.015.198-.027.3-.035a7.5 7.5 0 1114.698 2.139 7.5 7.5 0 01-6.7 6.507z" />
	</svg>
);

const EngineeringIcon = () => (
	<svg
		className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<title>Engineering Icon</title>
		<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
		<path
			fillRule="evenodd"
			d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
			clipRule="evenodd"
		/>
	</svg>
);

const QualityIcon = () => (
	<svg
		className="w-12 h-12 sm:w-16 sm:h-16 text-primary/30"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<title>Quality Icon</title>
		<path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" />
	</svg>
);

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
