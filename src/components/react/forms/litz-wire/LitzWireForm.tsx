import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/react/ui/card";
import { Form } from "@/components/react/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
	InputField,
	SelectField,
	type SelectOption,
} from "@/components/react/shared/FormFields";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PartNumberDisplay } from "./PartNumberDisplay";
import {
	type FormValues,
	ENAMEL_BUILDS,
	type LitzWireFormProps,
	MAGNET_WIRE_GRADES,
	SERVE_LAYERS,
	formSchema,
} from "./types";
import { generatePartNumber } from "./utils";

// Convert readonly arrays to mutable arrays for SelectField
const enamelBuildOptions: SelectOption[] = [...ENAMEL_BUILDS];
const magnetWireGradeOptions: SelectOption[] = [...MAGNET_WIRE_GRADES];
const serveLayerOptions: SelectOption[] = [...SERVE_LAYERS];

export function LitzWireForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: LitzWireFormProps) {
	const [partNumber, setPartNumber] = useState("RL-XXXX-XX-X-XX");

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			numberOfStrands: initialValues?.numberOfStrands ?? "",
			strandSize: initialValues?.strandSize ?? "",
			insulation: initialValues?.insulation ?? "",
			magnetWireGrade: initialValues?.magnetWireGrade ?? "",
			serveLayers: initialValues?.serveLayers,
			uniqueIdentifier: initialValues?.uniqueIdentifier ?? "XX",
		},
		mode: "onChange",
	});

	const formValues = form.watch();
	console.log("Form Values Changed:", formValues);

	useEffect(() => {
		try {
			console.log("Generating part number with values:", formValues);
			const newPartNumber = generatePartNumber(formValues);
			console.log("Generated part number:", newPartNumber);
			setPartNumber(newPartNumber);
			onSuccess?.(newPartNumber);
		} catch (error) {
			console.error("Error generating part number:", error);
			onError?.(
				error instanceof Error
					? error
					: new Error("Failed to generate part number"),
			);
		}
	}, [formValues, onSuccess, onError]);

	const handleNumberOfStrandsChange = (value: string) => {
		console.log("Number of strands changed to:", value);
		const currentStrandSize = form.getValues("strandSize");
		if (currentStrandSize) {
			const size = currentStrandSize.split("/")[1] || currentStrandSize;
			console.log(
				"Updating strand size with number of strands:",
				`${value}/${size}`,
			);
			form.setValue("strandSize", `${value}/${size}`, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		} else {
			console.log("Setting number of strands value:", value);
			form.setValue("numberOfStrands", value, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	const handleStrandSizeChange = (value: string) => {
		console.log("Strand size changed to:", value);
		const currentNumberOfStrands = form.getValues("numberOfStrands");
		if (currentNumberOfStrands) {
			console.log(
				"Updating strand size with size:",
				`${currentNumberOfStrands}/${value}`,
			);
			form.setValue("strandSize", `${currentNumberOfStrands}/${value}`, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		} else {
			console.log("Setting strand size value:", value);
			form.setValue("strandSize", value, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});
		}
	};

	return (
		<div
			className={cn(
				"relative mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-24",
				className,
			)}
		>
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
							<form
								onSubmit={form.handleSubmit(() => {})}
								className="space-y-6"
								noValidate
							>
								<InputField
									control={form.control}
									name="numberOfStrands"
									label="Number of Strands"
									placeholder="Enter number of strands"
									type="number"
									min={1}
									step={1}
									required
									inputMode="numeric"
									pattern="[0-9]*"
									onChange={handleNumberOfStrandsChange}
								/>

								<InputField
									control={form.control}
									name="strandSize"
									label="Strand Size (AWG 12-50)"
									placeholder="Enter AWG size (12-50)"
									type="number"
									min={12}
									max={50}
									step={1}
									required
									inputMode="numeric"
									pattern="[0-9]*"
									onChange={handleStrandSizeChange}
								/>

								<SelectField
									control={form.control}
									name="insulation"
									label="Enamel Build"
									placeholder="Select enamel build"
									options={enamelBuildOptions}
									required
								/>

								<SelectField
									control={form.control}
									name="magnetWireGrade"
									label="Magnet Wire Grade"
									placeholder="Select grade"
									options={magnetWireGradeOptions}
									required
									onChange={(value) => {
										console.log("Magnet wire grade changed to:", value);
										form.setValue("magnetWireGrade", value, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										});
									}}
								/>

								<SelectField
									control={form.control}
									name="serveLayers"
									label="Serve Layers (optional)"
									placeholder="Select serve layers"
									options={serveLayerOptions}
									onChange={(value) => {
										console.log("Serve layers changed to:", value);
										form.setValue("serveLayers", value, {
											shouldValidate: true,
											shouldDirty: true,
											shouldTouch: true,
										});
									}}
								/>

								<InputField
									control={form.control}
									name="uniqueIdentifier"
									label="Unique Identifier (optional)"
									placeholder="Enter identifier (default: XX)"
									type="text"
									onChange={(value) => {
										console.log("Unique identifier changed to:", value);
										form.setValue(
											"uniqueIdentifier",
											value.toUpperCase() || "XX",
											{
												shouldDirty: true,
												shouldTouch: true,
											},
										);
									}}
								/>
							</form>
						</Form>
					</CardContent>
				</Card>

				<PartNumberDisplay partNumber={partNumber} />
			</div>
			<Toaster />
		</div>
	);
}
