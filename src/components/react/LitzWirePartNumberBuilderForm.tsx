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
} from "@/components/react/ui/card";

const formSchema = z.object({
	rubadueLitz: z.literal("RL-"),
	numberOfStrands: z.string().min(1, "Required"),
	strandSize: z.string().min(1, "Required"),
	enamelBuild: z.string().min(1, "Required"),
	magnetWireGrade: z.string().min(1, "Required"),
	serveLayer: z.string().min(1, "Required"),
	uniqueIdentifier: z.string().min(1, "Required"),
});

const numberOfStrandsOptions = [
	{ value: "5-", label: "5 Strands" },
	{ value: "7-", label: "7 Strands" },
	{ value: "19-", label: "19 Strands" },
	{ value: "41-", label: "41 Strands" },
	{ value: "625-", label: "625 Strands" },
	{ value: "10000-", label: "10,000 Strands" },
];

const enamelBuildOptions = [
	{ value: "S", label: "Single" },
	{ value: "H", label: "Heavy" },
	{ value: "T", label: "Triple" },
	{ value: "Q", label: "Quad" },
];

const magnetWireGradeOptions = [
	{ value: "79", label: "MW 79-C" },
	{ value: "80", label: "MW 80-C" },
	{ value: "77", label: "MW 77-C" },
	{ value: "35", label: "MW 35-C" },
	{ value: "16", label: "MW 16-C" },
	{ value: "82", label: "MW 82-C" },
	{ value: "83", label: "MW 83-C" },
];

const serveLayerOptions = [
	{ value: "-SN", label: "Single Nylon Serve" },
	{ value: "-DN", label: "Double Nylon Serve" },
	{ value: "NONE", label: "No Serve" },
];

const uniqueIdentifierOptions = [
	{ value: "-01", label: "Construction 1" },
	{ value: "-02", label: "Construction 2" },
];

export default function LitzWirePartNumberBuilder() {
	const [partNumber, setPartNumber] = useState("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			rubadueLitz: "RL-",
			numberOfStrands: "",
			strandSize: "",
			enamelBuild: "",
			magnetWireGrade: "",
			serveLayer: "NONE",
			uniqueIdentifier: "",
		},
	});

	const formValues = form.watch();

	useEffect(() => {
		const serveLayerValue =
			formValues.serveLayer === "NONE" ? "" : formValues.serveLayer;
		const newPartNumber = `${formValues.rubadueLitz}${formValues.numberOfStrands}${formValues.strandSize}${formValues.enamelBuild}${formValues.magnetWireGrade}${serveLayerValue}${formValues.uniqueIdentifier}`;
		setPartNumber(newPartNumber);
	}, [formValues]);

	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-24">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Card>
					<CardHeader>
						<CardTitle>Build Your Part Number</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form className="space-y-6">
								<FormField
									control={form.control}
									name="numberOfStrands"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Number of Strands</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select number of strands" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{numberOfStrandsOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
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
									name="strandSize"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Strand Size (AWG)</FormLabel>
											<FormControl>
												<Input placeholder="Enter AWG (12-50)" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="enamelBuild"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Enamel Build</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select enamel build" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{enamelBuildOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
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
									name="magnetWireGrade"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Magnet Wire Grade</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select magnet wire grade" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{magnetWireGradeOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
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
									name="serveLayer"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Serve Layer(s)</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select serve layer" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{serveLayerOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
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
									name="uniqueIdentifier"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Unique Identifier</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select identifier" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{uniqueIdentifierOptions.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</CardContent>
				</Card>

				<Card className="bg-background">
					<CardHeader>
						<CardTitle>Generated Part Number</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-mono bg-white p-4 rounded border">
							{partNumber || "RL-_ _ _ _ _ _ _"}
						</div>

						<div className="mt-8">
							<h3 className="text-lg font-semibold mb-4">
								Example Part Numbers:
							</h3>
							<div className="space-y-4">
								<div>
									<p className="font-mono">RL-2500-44S77-02</p>
									<p className="text-sm text-gray-600">
										Rubadue Litz, 2500 Strands, 44 AWG, Single Build, MW 77-C,
										No Serve, Construction 2
									</p>
								</div>
								<div>
									<p className="font-mono">RL-400-38H79-SN-03</p>
									<p className="text-sm text-gray-600">
										Rubadue Litz, 400 Strands, 38 AWG, Heavy Build, MW 79-C,
										Single Nylon Serve, Construction 3
									</p>
								</div>
								<div>
									<p className="font-mono">RL-5-30Q80-DN-01</p>
									<p className="text-sm text-gray-600">
										Rubadue Litz, 5 Strands, 30 AWG, Quad Build, MW 80-C, Double
										Nylon Serve, Construction 1
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
