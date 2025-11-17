import {
	Award,
	Building,
	Building2,
	Car,
	Eye,
	Factory,
	Gauge,
	Handshake,
	HeartPulse,
	Lightbulb,
	Merge,
	Move,
	Plane,
	RefreshCw,
	Rocket,
	Settings,
	Target,
	Trophy,
	X,
	Users,
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
	twitter: X,
	building: Building,
	move: Move,
	trophy: Trophy,
	building2: Building2,
	merge: Merge,
	"refresh-cw": RefreshCw,
	settings: Settings,
	rocket: Rocket,
} as const;
