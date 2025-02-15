import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react/ui/form";
import { Input } from "@/components/react/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/react/ui/card";
import { Button } from "@/components/react/ui/button";
import { Copy } from "lucide-react";
import { toast, Toaster } from "sonner";

const formSchema = z.object({
	layers: z.string().min(1, "Required"),
	awgSize: z
		.string()
		.min(1, "Required")
		.refine((val) => {
			if (val.toUpperCase() === "XX") return true;
			const num = Number(val);
			return !Number.isNaN(num) && num >= 4 && num <= 40;
		}, "Must be between 4-40 AWG or XX for Litz wire"),
	conductor: z.string().min(1, "Required"),
	strands: z.string().min(1, "Required"),
	insulation: z.string().min(1, "Required"),
	color: z.string().min(1, "Required"),
	thickness: z.string().refine((val) => {
		if (!val) return true;
		if (val.startsWith("-")) {
			const num = Number(val.substring(1));
			return !Number.isNaN(num) && num >= 0.001 && num <= 0.25;
		}
		return true;
	}, "Thickness must be between 0.001 and 0.250"),
});

type FormData = z.infer<typeof formSchema>;

const layersOptions = [
	{ value: "S", label: "Single (1) Basic" },
	{ value: "D", label: "Double (2) Supplemental" },
	{ value: "T", label: "Triple (3) Reinforced" },
];

const conductorMaterials = [
	{ value: "A", label: "TPC (Tin Plated Copper)" },
	{ value: "B", label: "SPC (Silver Plated Copper)" },
	{ value: "C", label: "BS (Bare Copper)" },
	{ value: "D", label: "SPA 135" },
	{ value: "E", label: "Enamel" },
	{ value: "H", label: "Heavy Enamel" },
	{ value: "L", label: "Litz Wire" },
	{ value: "N", label: "NPC (Nickel Plated Copper)" },
	{ value: "Q", label: "QPN" },
	{ value: "S", label: "Stainless Steel" },
	{ value: "custom", label: "Contact Customer Service" },
	{ value: "other", label: "Others Available" },
];

const strandsOptions = [
	{ value: "01", label: "Solid" },
	{ value: "07", label: "7 Strands" },
	{ value: "19", label: "19 Strands" },
	{ value: "37", label: "37 Strands" },
	{ value: "65", label: "65 Strands" },
	{ value: "litz", label: "Litz (# Strands/AWG)" },
	{ value: "other", label: "Others Available" },
];

const insulationTypes = [
	{ value: "F", label: "FEP" },
	{ value: "H", label: "Hytrel" },
	{ value: "K", label: "Kynar PVDF" },
	{ value: "N", label: "Nylon" },
	{ value: "P", label: "PFA" },
	{ value: "PE", label: "Polyethylene" },
	{ value: "PF", label: "Foam PE" },
	{ value: "U", label: "Polyurethane" },
	{ value: "V", label: "PVC" },
	{ value: "Z", label: "Special ETFE (200°C)" },
	{ value: "EC", label: "300°C" },
	{ value: "other", label: "Others Available" },
];

const colorCodes = [
	{ value: "0", label: "Black (right color)" },
	{ value: "1", label: "Brown (right color)" },
	{ value: "2", label: "Red (right color)" },
	{ value: "3", label: "Orange (right color)" },
	{ value: "4", label: "Yellow (right color)" },
	{ value: "5", label: "Green (right color)" },
	{ value: "6", label: "Blue (right color)" },
	{ value: "7", label: "Violet (right color)" },
	{ value: "8", label: "Gray (right color)" },
	{ value: "9", label: "White (right color)" },
	{ value: "C", label: "Clear" },
];

const thicknessOptions = [
	{ value: "-1", label: '.001"/layer' },
	{ value: "-1.5", label: '.0015"/layer' },
	{ value: "-2", label: '.002"/layer' },
	{ value: "-3", label: '.003"/layer' },
	{ value: "-5", label: '.005"/layer' },
	{ value: "other", label: "Other" },
];

export default function InsulatedWindingWirePartNumberBuilder() {
	const [partNumber, setPartNumber] = useState("");
	const [showCustomThickness, setShowCustomThickness] = useState(false);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			layers: "",
			awgSize: "",
			conductor: "",
			strands: "",
			insulation: "",
			color: "",
			thickness: "",
		},
		mode: "onChange",
	});

	const formValues = form.watch();

	useEffect(() => {
		// Format AWG size to be 2 digits
		let formattedAwgSize = formValues.awgSize;
		if (
			formattedAwgSize &&
			formattedAwgSize !== "XX" &&
			!Number.isNaN(Number(formattedAwgSize))
		) {
			formattedAwgSize = formattedAwgSize.padStart(2, "0");
		}

		const newPartNumber = `${formValues.layers}${formattedAwgSize}${formValues.conductor}${formValues.strands}${formValues.insulation}${formValues.color}${formValues.thickness}`;
		setPartNumber(newPartNumber);
	}, [formValues]);

	const copyToClipboard = () => {
		if (partNumber) {
			navigator.clipboard.writeText(partNumber);
			toast.success("Part number copied!", {
				description: "The part number has been copied to your clipboard",
			});
		}
	};

	return (
		<>
			<div className="relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-24 ">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Card>
						<CardHeader>
							<CardTitle>Build Your Part Number</CardTitle>
							<CardDescription>
								Fill out the form to generate your custom part number
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form className="space-y-6">
									<FormField
										control={form.control}
										name="layers"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Layers of Insulation</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select layers" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{layersOptions.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="awgSize"
										render={({ field }) => (
											<FormItem>
												<FormLabel>AWG Size (4-40 or XX for Litz)</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter AWG size (4-40 or XX)"
														{...field}
														onChange={(e) => {
															const value = e.target.value.toUpperCase();
															field.onChange(value);
															form.trigger("awgSize");
														}}
														onBlur={(e) => {
															field.onBlur();
															form.trigger("awgSize");
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="conductor"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Conductor Material</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select conductor" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{conductorMaterials.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="strands"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Strands in Conductor</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select strands" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{strandsOptions.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="insulation"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Insulation Type</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select insulation" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{insulationTypes.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="color"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Color Code</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select color" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{colorCodes.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
																{option.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="thickness"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Insulation Thickness per Layer</FormLabel>
												<div className="space-y-2">
													<Select
														onValueChange={(value) => {
															if (value === "other") {
																setShowCustomThickness(true);
																field.onChange("");
															} else {
																setShowCustomThickness(false);
																field.onChange(value);
															}
														}}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select thickness" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{thicknessOptions.map((option) => (
																<SelectItem
																	key={option.value}
																	value={option.value}
																>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>

													{showCustomThickness && (
														<FormControl>
															<Input
																type="number"
																step="0.001"
																min="0.001"
																max="0.250"
																placeholder="Enter thickness (0.001-0.250)"
																onChange={(e) => {
																	const value = Number.parseFloat(
																		e.target.value,
																	);
																	if (!e.target.value) {
																		field.onChange("");
																	} else if (value >= 0.001 && value <= 0.25) {
																		field.onChange(`-${value}`);
																	}
																}}
															/>
														</FormControl>
													)}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						</CardContent>
					</Card>

					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Generated Part Number</CardTitle>
								<CardDescription>
									Your custom part number will appear here as you fill out the
									form
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<Input
											value={partNumber}
											disabled
											className="font-mono text-xl w-48"
											placeholder="Part number"
										/>
										<Button
											variant="outline"
											size="sm"
											className="gap-2"
											onClick={copyToClipboard}
											disabled={!partNumber}
										>
											<Copy className="h-4 w-4" />
											Copy
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Example Part Numbers</CardTitle>
							</CardHeader>
							<CardContent className="space-y-8">
								<div>
									<div className="text-2xl font-mono tracking-wider mb-2">
										T24A01P0XX
									</div>
									<p className="text-sm text-muted-foreground">
										Triple Insulated (3), 24 AWG, Tin Plated Copper, Solid
										Conductor, PFA, Black, .002"/layer (.002" needed)
									</p>
								</div>
								<div>
									<div className="text-2xl font-mono tracking-wider mb-2">
										DXXL360F6X
									</div>
									<p className="text-sm text-muted-foreground">
										Double Insulated (2), Always Defined XX, LITZ, 360/44
										Strands/AWG, FEP, Blue, .003"/layer (.003" needed)
									</p>
								</div>
								<div>
									<div className="text-2xl font-mono tracking-wider mb-2">
										T24A01T5X-1.5-SB-1.5
									</div>
									<p className="text-sm text-muted-foreground">
										Triple Insulated (3), 24 AWG, Tin Plated Copper, Solid
										Conductor, ETFE, Green, .0015"/layer, Self-Bonding,
										.0015"/layer
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<Toaster />
		</>
	);
}
