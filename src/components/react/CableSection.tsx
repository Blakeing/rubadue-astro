import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WaveBackground } from "./WaveBackground";

// Import images
import litzWireImage from "@/assets/litz-wire-removebg-preview.png";
import singleInsulatedImage from "@/assets/single_insulated-removebg-preview.png";
import doubleInsulatedImage from "@/assets/double_insulated-removebg-preview.png";
import tripleInsulatedImage from "@/assets/triple_insulated-removebg-preview.png";

const features = [
	{
		name: "Single Insulated",
		description:
			"Rubadue wire manufactures several wire with a single layer of insulation.",
		image: singleInsulatedImage,
	},
	{
		name: "Double Insulated",
		description:
			"Rubadue wire manufactures several double insulated wires to be used in supplementary isolation applications",
		image: doubleInsulatedImage,
	},
	{
		name: "Triple Insulated",
		description:
			"Rubadue wire was the first company to design and manufacture triple insulated wires.",
		image: tripleInsulatedImage,
	},
	{
		name: "Bare Litz",
		description:
			"Litz wire is made of several strands of enameled magnet wire that are bunched or stranded together.",
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
		<div className="overflow-hidden py-24 sm:py-32">
			<div className="mx-auto max-w-7xl md:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
					<div className="px-6 lg:px-0 ">
						<div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
							<h2 className="text-xl font-display text-accent-foreground">
								Wire <span className="text-primary">Types</span>
							</h2>
							<p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
								Cables to Meet Your Needs
							</p>
							<p className="mt-6 text-lg text-muted-foreground">
								Browse a wide variety of specialty cables. All cable components
								can be adapted to meet your requirements.
							</p>
							<dl className="mt-10 max-w-xl space-y-8 text-base text-muted-foreground lg:max-w-none">
								{features.map((feature, index) => (
									<motion.div
										key={feature.name}
										className="relative cursor-pointer select-none"
										onHoverStart={() => setActiveFeature(index)}
										animate={{
											color:
												activeFeature === index
													? "hsl(var(--primary))"
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
					</div>
					<div className="sm:px-6 lg:px-0">
						<div className="relative isolate overflow-hidden bg-primary/5 px-6  sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0  lg:mx-0 lg:max-w-none">
							<div
								className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-49deg] bg-primary opacity-20 ring-1 ring-inset ring-white"
								aria-hidden="true"
							/>
							<div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
								<div className="relative w-[48rem] aspect-square sm:w-[33rem]">
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
								className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
