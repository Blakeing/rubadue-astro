import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import { icons, type IconName } from "@/components/react/icons";
import type React from "react";

interface MissionVisionCardProps {
	title: string;
	description: string;
	icon: IconName;
}

const MissionVisionCard: React.FC<MissionVisionCardProps> = ({
	title,
	description,
	icon,
}) => {
	const Icon = icons[icon];

	return (
		<Card className="group hover:shadow-lg transition-shadow duration-300">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Icon className="text-2xl text-primary" />
					<CardTitle className="text-primary">{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-base sm:text-lg text-muted-foreground">
					{description}
				</p>
			</CardContent>
		</Card>
	);
};

export default MissionVisionCard;
