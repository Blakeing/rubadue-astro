import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { icons, type IconName } from "@/components/react/icons";
import { Card, CardContent } from "@/components/react/ui";
import { cn } from "@/lib/utils";

type TimelineEntry = {
	year: string;
	description: string;
	icon?: IconName;
};

type TimelineProps = {
	data: TimelineEntry[];
	title?: string;
	description?: string;
};

const ANIMATION_VARIANTS = {
	title: {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
		},
	},
	description: {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
		},
	},
	card: {
		hidden: (isEven: boolean) => ({
			opacity: 0,
			x: isEven ? -50 : 50,
		}),
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
		},
	},
	dot: {
		hidden: { scale: 0 },
		visible: {
			scale: 1,
			transition: { duration: 0.4, delay: 0.2 },
		},
	},
};

const TimelineCard: React.FC<{
	entry: TimelineEntry;
	isEven: boolean;
}> = ({ entry, isEven }) => (
	<motion.div
		className={cn("md:pr-12", isEven ? "md:text-right" : "md:pl-12")}
		custom={isEven}
		initial="hidden"
		whileInView="visible"
		viewport={{ once: true }}
		variants={ANIMATION_VARIANTS.card}
	>
		<Card className="group hover:shadow-lg transition-shadow duration-300">
			<CardContent className="p-6">
				<div
					className={cn(
						"flex items-center gap-3 mb-3",
						isEven && "md:justify-end",
					)}
				>
					{entry.icon && (
						<div className="rounded-full bg-primary/10 p-2">
							{React.createElement(icons[entry.icon], {
								className: "h-5 w-5 text-primary",
							})}
						</div>
					)}
					{!isEven && (
						<h3 className="text-xl font-display text-foreground">
							{entry.year}
						</h3>
					)}
					{isEven && (
						<h3 className="text-xl font-display text-foreground">
							{entry.year}
						</h3>
					)}
				</div>
				<p
					className={cn(
						"text-base text-pretty text-muted-foreground leading-relaxed text-left",
						"md:text-left",
						isEven && "md:text-right",
					)}
				>
					{entry.description}
				</p>
			</CardContent>
		</Card>
	</motion.div>
);

const Timeline: React.FC<TimelineProps> = ({ data, title, description }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const updateHeight = () => {
			if (ref.current) {
				setHeight(ref.current.getBoundingClientRect().height);
			}
		};

		updateHeight();
		window.addEventListener("resize", updateHeight);
		return () => window.removeEventListener("resize", updateHeight);
	}, []);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 75%", "end 100%"],
	});

	const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
	const opacityTransform = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

	return (
		<div className="relative">
			<div ref={ref} className="relative mx-auto ">
				<div className="absolute hidden md:block left-1/2 -translate-x-[1px] top-0 h-full w-[2px] bg-border" />

				{data.map((item, index) => (
					<div
						key={`${item.year}-${item.description}`}
						className="relative flex items-center justify-center mb-8 md:mb-16"
					>
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={ANIMATION_VARIANTS.dot}
							className="absolute hidden md:flex left-[calc(50%-8px)] -translate-x-[8px] items-center justify-center w-4 h-4 z-10"
						>
							<div className="absolute w-4 h-4 rounded-full border-2 border-primary bg-background" />
							<div className="absolute w-2 h-2 rounded-full bg-primary" />
						</motion.div>

						<div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-8">
							{index % 2 === 0 ? (
								<>
									<TimelineCard entry={item} isEven={true} />
									<div className="hidden md:block" />
								</>
							) : (
								<>
									<div className="hidden md:block" />
									<TimelineCard entry={item} isEven={false} />
								</>
							)}
						</div>
					</div>
				))}

				<motion.div
					style={{ height: heightTransform, opacity: opacityTransform }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					className="absolute hidden md:block left-1/2 -translate-x-[1px] top-0 w-[2px] bg-primary/50 origin-top"
				/>
			</div>
		</div>
	);
};

export default Timeline;
