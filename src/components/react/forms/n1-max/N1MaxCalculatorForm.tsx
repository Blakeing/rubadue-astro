import {
	Button,
	Card,
	CardContent,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Switch,
} from "@/components/react/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { InputField, SelectField } from "@/components/react/shared/FormFields";
import type {
	CalculationResults,
	FormValues,
	MaterialKey,
	TemperatureUnit,
} from "./types";
import {
	awgData,
	calculatorDescription,
	formSchema,
	materialPresets,
} from "./types";
import {
	calculateResults,
	celsiusToFahrenheit,
	fahrenheitToCelsius,
} from "./utils";

import { MinusIcon, PlusIcon } from "lucide-react";

/**
 * Props for the N1 Max Calculator form
 */
interface N1MaxCalculatorFormProps {
	/** Initial form values */
	initialValues?: Partial<FormValues>;
	/** Callback when results are calculated */
	onResultsCalculated?: (results: CalculationResults) => void;
	/** Whether to show the chart */
	showChart?: boolean;
	/** Additional class name for the form */
	className?: string;
}

/**
 * N1 Max Calculator form component
 */
export default function N1MaxCalculatorForm({
	initialValues,
	onResultsCalculated,
	showChart = true,
	className,
}: N1MaxCalculatorFormProps) {
	const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F");
	const [selectedMaterial, setSelectedMaterial] =
		useState<MaterialKey>("copper");
	const [results, setResults] = useState<CalculationResults>({
		skinDepth: 0,
		doubleSkinDepth: 0,
		n1Max: 0,
		resistivity: 0,
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			frequency: 1200,
			permeability: materialPresets.copper.permeability,
			temperature: 68,
			awg: "18",
			...initialValues,
		},
		mode: "onChange",
	});

	const { control, watch, setValue } = form;

	// Watch form values
	const formValues = watch();

	// Extract and validate numeric values
	const frequency = Number(formValues.frequency);
	const permeability = Number(formValues.permeability);
	const temperature = Math.trunc(Number(formValues.temperature));
	const { awg } = formValues;

	// Validate numeric values
	const isValidForm =
		!Number.isNaN(frequency) &&
		!Number.isNaN(permeability) &&
		!Number.isNaN(temperature);

	// Handle material preset selection
	const handleMaterialChange = useCallback(
		(value: MaterialKey) => {
			setSelectedMaterial(value);
			setValue("permeability", materialPresets[value].permeability, {
				shouldValidate: true,
			});
		},
		[setValue],
	);

	// Handle temperature unit change
	const handleTemperatureUnitChange = (checked: boolean) => {
		const newUnit = checked ? "C" : "F";
		const currentTemp = Number(formValues.temperature);

		// Convert the current temperature value
		const newTemp =
			newUnit === "C"
				? Math.round(fahrenheitToCelsius(currentTemp))
				: Math.round(celsiusToFahrenheit(currentTemp));

		setTemperatureUnit(newUnit);
		setValue("temperature", newTemp);
	};

	// Update results when form values change
	useEffect(() => {
		if (!isValidForm) return;

		try {
			if (
				frequency > 0 &&
				permeability >= 0 &&
				temperature >= -459.67 &&
				awg in awgData
			) {
				const newResults = calculateResults(
					{
						frequency,
						permeability,
						temperature,
						awg,
					},
					selectedMaterial,
					temperatureUnit,
				);
				setResults(newResults);
				onResultsCalculated?.(newResults);
			}
		} catch (error) {
			// Set results to zero state
			const zeroResults = {
				skinDepth: 0,
				doubleSkinDepth: 0,
				n1Max: 0,
				resistivity: 0,
			};
			setResults(zeroResults);
			onResultsCalculated?.(zeroResults);

			// Only log in development
			if (process.env.NODE_ENV === "development") {
				console.error("Error calculating results:", error);
			}
		}
	}, [
		isValidForm,
		frequency,
		permeability,
		temperature,
		awg,
		selectedMaterial,
		temperatureUnit,
		onResultsCalculated,
	]);

	// Generate chart data
	const chartData =
		showChart && isValidForm
			? Array.from({ length: 10 }, (_, i) => {
					const freq = frequency * (i + 1);
					return {
						frequency: freq,
						...calculateResults(
							{
								frequency: freq,
								permeability,
								temperature,
								awg,
							},
							selectedMaterial,
							temperatureUnit,
						),
					};
				})
			: [];

	return (
		<div className={className}>
			<div className="mb-6 space-y-2">
				<h2 className="text-2xl font-bold">{calculatorDescription.title}</h2>
				<p className="text-muted-foreground">
					{calculatorDescription.description}
				</p>
				<p className="text-sm text-muted-foreground">
					{calculatorDescription.frequencyNote}
				</p>
			</div>

			<div className="grid gap-6 grid-cols-5">
				<Card className="col-span-2">
					<CardContent className="pt-6">
						<Form {...form}>
							<form className="space-y-4">
								<InputField
									control={control}
									name="frequency"
									label="Frequency (Hz)"
									placeholder="Enter frequency"
									type="number"
									min={1}
									required
								/>

								<div className="space-y-2">
									<Label>Material</Label>
									<Select
										value={selectedMaterial}
										onValueChange={handleMaterialChange}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select material" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(materialPresets).map(
												([key, material]) => (
													<SelectItem key={key} value={key}>
														{material.name}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
								</div>

								<InputField
									control={control}
									name="permeability"
									label="Magnetic Permeability (H/m)"
									placeholder="Enter permeability"
									type="number"
									min={0}
									step={1e-12}
									required
								/>

								<div className="space-y-2">
									<Label>Temperature Unit</Label>
									<div className="flex items-center space-x-2">
										<Switch
											checked={temperatureUnit === "C"}
											onCheckedChange={handleTemperatureUnitChange}
										/>
										<span>
											{temperatureUnit === "C" ? "Celsius" : "Fahrenheit"}
										</span>
									</div>
								</div>

								{/* Temperature Input */}
								<FormField
									control={control}
									name="temperature"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Temperature (°{temperatureUnit})</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="text"
													inputMode="numeric"
													pattern="[0-9]*"
													value={field.value}
													onChange={(e) => {
														const val = e.target.value.replace(/[^0-9-]/g, "");
														if (val === "" || val === "-") {
															field.onChange(val);
														} else {
															const num = Number(val);
															if (!Number.isNaN(num)) {
																field.onChange(num);
															}
														}
													}}
													onKeyDown={(e) => {
														if (e.key === "ArrowUp") {
															e.preventDefault();
															const current = Number(field.value);
															if (!Number.isNaN(current)) {
																field.onChange(current + 1);
															}
														} else if (e.key === "ArrowDown") {
															e.preventDefault();
															const current = Number(field.value);
															if (!Number.isNaN(current)) {
																field.onChange(current - 1);
															}
														}
													}}
													placeholder="Enter temperature"
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<SelectField
									control={control}
									name="awg"
									label="AWG Size"
									placeholder="Select AWG size"
									options={Object.keys(awgData).map((awg) => ({
										value: awg,
										label: `${awg} AWG`,
									}))}
									required
								/>
							</form>
						</Form>
					</CardContent>
				</Card>

				<Card className="col-span-3">
					<CardContent className="pt-6">
						<div className="space-y-8">
							<div>
								<div className="mb-2">
									<h3 className="font-semibold">N1 Max</h3>
									<p className="text-3xl font-bold">{results.n1Max}</p>
								</div>
								<p className="text-sm text-muted-foreground">
									{calculatorDescription.n1MaxNote}
								</p>
							</div>

							<div>
								<div className="mb-2">
									<h3 className="font-semibold">Skin Depth</h3>
									<p className="text-xl font-semibold">
										{(results.skinDepth * 1000).toFixed(4)} mm
									</p>
								</div>
								<p className="text-sm text-muted-foreground whitespace-pre-line">
									{calculatorDescription.skinDepthNote}
								</p>
							</div>

							{/* Chart removed - can be re-added when needed */}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
