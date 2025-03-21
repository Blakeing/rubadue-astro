import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Separator,
} from "@/components/react/ui";
import { type IconName, icons } from "./icons";
import { motion } from "framer-motion";

interface MarketCardProps {
	name: string;
	tagline: string;
	description: string;
	applications: string[];
	products: string[];
	icon: IconName;
}

export function MarketCard({
	name,
	tagline,
	description,
	applications,
	products,
	icon,
}: MarketCardProps) {
	const Icon = icons[icon];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className="group"
		>
			<Card className="relative border-border transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-x-4">
						<div className="flex size-12 sm:size-16 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-300  group-hover:shadow-lg">
							<Icon className="size-8 sm:size-10" />
						</div>
						<div>
							<CardTitle className="text-base sm:text-lg font-semibold leading-6 sm:leading-8 text-foreground ">
								{name}
							</CardTitle>
							<CardDescription className="text-primary text-sm sm:text-base">
								{tagline}
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm sm:text-base leading-6 sm:leading-7 text-muted-foreground">
						{description}
					</p>
					<div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
						<div>
							<h4 className="text-sm sm:text-base font-medium text-foreground">
								Applications
							</h4>
							<Separator className="my-2" />
							<div className="mt-2 flex flex-wrap gap-2">
								{applications.map((app) => (
									<Badge
										key={app}
										variant="outline"
										className="border-border text-foreground text-xs sm:text-sm transition-all duration-300 hover:bg-primary/10"
									>
										{app}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h4 className="text-sm sm:text-base font-medium text-foreground">
								Products
							</h4>
							<Separator className="my-2" />
							<div className="mt-2 flex flex-wrap gap-2">
								{products.map((product) => (
									<Badge
										key={product}
										variant="outline"
										className="border-border text-foreground text-xs sm:text-sm transition-all duration-300 hover:bg-primary/10"
									>
										{product}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
