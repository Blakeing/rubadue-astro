import {
	Car,
	HeartPulse,
	Plane,
	Factory,
	Target,
	Eye,
	Gauge,
	Handshake,
	Lightbulb,
	Users,
	Award,
	Linkedin,
	Twitter,
	Building,
	Move,
	Trophy,
	Building2,
	Merge,
	RefreshCw,
	Settings,
	Rocket,
} from "lucide-react";

export type IconName =
	| "car"
	| "heart-pulse"
	| "plane"
	| "factory"
	| "target"
	| "eye"
	| "gauge"
	| "handshake"
	| "lightbulb"
	| "users"
	| "award"
	| "linkedin"
	| "twitter"
	| "building"
	| "move"
	| "trophy"
	| "building2"
	| "merge"
	| "refresh-cw"
	| "settings"
	| "rocket";

export const icons = {
	car: Car,
	"heart-pulse": HeartPulse,
	plane: Plane,
	factory: Factory,
	target: Target,
	eye: Eye,
	gauge: Gauge,
	handshake: Handshake,
	lightbulb: Lightbulb,
	users: Users,
	award: Award,
	linkedin: Linkedin,
	twitter: Twitter,
	building: Building,
	move: Move,
	trophy: Trophy,
	building2: Building2,
	merge: Merge,
	"refresh-cw": RefreshCw,
	settings: Settings,
	rocket: Rocket,
} as const;

export type IconProps = React.ComponentProps<typeof Car>;
