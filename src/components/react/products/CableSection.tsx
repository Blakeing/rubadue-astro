import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import doubleInsulatedImage from "@/assets/double_insulated-removebg-preview.png";
// Import images
import litzWireImage from "@/assets/litz-wire-removebg-preview.png";
import singleInsulatedImage from "@/assets/single_insulated-removebg-preview.png";
import tripleInsulatedImage from "@/assets/triple_insulated-removebg-preview.png";

const features = [
	{
		name: "Single Insulated",
		description: "wires for applications requiring basic insulation.",
		image: singleInsulatedImage,
	},
	{
		name: "Double Insulated",
		description: "wires for use in supplementary insulation applications.",
		image: doubleInsulatedImage,
	},
	{
		name: "Triple Insulated",
		description: "with extruded insulation.",
		image: tripleInsulatedImage,
	},
	{
		name: "Bare Litz",
		description:
			"wires made of several strands of enameled magnet wire that are bunched or stranded together to reduce skin and proximity effect losses at higher frequencies.",
		image: litzWireImage,
	},
];

const variants = {
	enter: {
		x: 1000,
		opacity: 0,
		scale: 0.9,
	},
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	},
	exit: {
		x: 1000,
		opacity: 0,
		scale: 0.9,
		transition: {
			duration: 0.5,
			ease: "easeInOut",
		},
	},
};

// function CircleDecorations() {
// 	return (
// 		<>
// 			{/* Large outer circle with light orange border */}
// 			<div className="absolute size-[665px] -top-[80%] -left-[30%] rounded-full border-[13px] border-primary/10 pointer-events-none z-0 rotate-[-15deg]" />
// 			{/* Inner circle with solid orange border */}
// 			<div className="absolute size-[665px] -top-[85%] -left-[25%] rounded-full border-2 border-primary pointer-events-none z-0 rotate-[-15deg]" />
// 		</>
// 	);
// }

export default function CableSection() {
	const [activeFeature, setActiveFeature] = useState(0);

	return (
		<div className="overflow-hidden py-8 sm:py-12 md:py-16 lg:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2 lg:items-start">
					<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
						<h2 className="text-base/7 font-semibold text-primary font-display">
							Wire Types
						</h2>
						<p className="mt-2 text-pretty text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
							Cables to Meet Your Needs
						</p>
						<p className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground">
							All cable and wire components can be adapted to meet your
							requirements.
						</p>
						<dl className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-sm sm:text-base text-muted-foreground lg:max-w-none">
							{features.map((feature, index) => (
								<motion.div
									key={feature.name}
									className="relative cursor-pointer select-none"
									onHoverStart={() => setActiveFeature(index)}
									onClick={() => setActiveFeature(index)}
									initial={{ color: "hsl(var(--muted-foreground))" }}
									animate={{
										color:
											activeFeature === index
												? "hsl(var(--primary) / 0.8)"
												: "hsl(var(--muted-foreground))",
									}}
									transition={{ duration: 0.15 }}
								>
									<dt className="inline font-semibold text-foreground">
										{feature.name}
									</dt>{" "}
									<dd className="inline">{feature.description}</dd>
								</motion.div>
							))}
						</dl>
					</div>
					<div className="mt-4 sm:mt-6 lg:mt-0">
						<div className="relative isolate overflow-hidden bg-muted/05 pl-4 sm:pl-6 lg:pl-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl lg:mx-0 lg:max-w-none">
							<div
								className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-49deg] bg-muted opacity-20 ring-1 ring-inset ring-ring"
								aria-hidden="true"
							/>
							<div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
								<div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] ">
									<AnimatePresence mode="popLayout">
										<motion.div
											key={activeFeature}
											variants={variants}
											initial="enter"
											animate="center"
											exit="exit"
											className="absolute inset-0"
										>
											<img
												src={features[activeFeature].image.src}
												alt={`${features[activeFeature].name} illustration`}
												width={2432}
												height={1442}
												className="w-full h-full object-contain rounded-tl-xl"
											/>
										</motion.div>
									</AnimatePresence>
								</div>
							</div>
							<div
								className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ring/10 sm:rounded-3xl"
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
