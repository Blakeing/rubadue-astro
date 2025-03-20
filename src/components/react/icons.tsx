import { Car, HeartPulse, Plane, Factory } from "lucide-react";

export type IconName = "car" | "heart-pulse" | "plane" | "factory";

export const icons = {
	car: Car,
	"heart-pulse": HeartPulse,
	plane: Plane,
	factory: Factory,
} as const;

export type IconProps = React.ComponentProps<typeof Car>;
