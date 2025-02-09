import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/react/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/react/ui/select";
import { useState, useEffect } from "react";
import { Label } from "@/components/react/ui/label";
import { Card, CardContent } from "@/components/react/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/react/ui/tooltip";
import { Switch } from "@/components/react/ui/switch";

// Add type for AWG keys
type AWGKey = keyof typeof awgData;

// Add type for material keys
type MaterialKey = keyof typeof materialPresets;

// Add type for AWG values
type AWGValue = keyof typeof awgData;

// Add temperature unit type
type TemperatureUnit = "F" | "C";

// Add length unit type
type LengthUnit = "m" | "ft";

// Add temperature conversion functions
const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * (5 / 9);
const celsiusToFahrenheit = (celsius: number) => celsius * (9 / 5) + 32;

// Add length conversion functions
const feetToMeters = (feet: number) => feet * 0.3048;
const metersToFeet = (meters: number) => meters * 3.28084;

const formSchema = z.object({
  frequency: z.number().min(1, "Frequency must be greater than 0"),
  permeability: z.number().min(0, "Permeability cannot be negative"),
  temperature: z
    .number()
    .min(-459.67, "Temperature cannot be below absolute zero"),
  awg: z.string().refine((val): val is AWGKey => val in awgData),
});

const awgData = {
  "12": 2.05232,
  "14": 1.62814,
  "16": 1.29032,
  "18": 1.02362,
  "20": 0.8128,
  "22": 0.64384,
  "24": 0.51054,
  "26": 0.40386,
  "28": 0.32004,
  "30": 0.254,
};

const awgOptions = Object.keys(awgData);

const materialPresets = {
  copper: {
    name: "Copper",
    permeability: 1.256665e-6,
    baseResistivity: 1.72e-8, // resistivity at room temperature (20°C)
    tempCoeff: 0.00393, // temperature coefficient of resistance for copper
  },
  aluminum: {
    name: "Aluminum",
    permeability: 1.256665e-6,
    baseResistivity: 2.82e-8,
    tempCoeff: 0.00429,
  },
  silver: {
    name: "Silver",
    permeability: 1.256665e-6,
    baseResistivity: 1.59e-8,
    tempCoeff: 0.0038,
  },
  gold: {
    name: "Gold",
    permeability: 1.256665e-6,
    baseResistivity: 2.44e-8,
    tempCoeff: 0.0034,
  },
};

const calculateResistivity = (
  baseResistivity: number,
  tempCoeff: number,
  temperature: number,
  unit: TemperatureUnit
) => {
  // Convert to Celsius if needed
  const temperatureC =
    unit === "F" ? fahrenheitToCelsius(temperature) : temperature;
  // Calculate resistivity at given temperature using the formula:
  // ρ(T) = ρ₀[1 + α(T - T₀)]
  // where T₀ is room temperature (20°C)
  return baseResistivity * (1 + tempCoeff * (temperatureC - 20));
};

const calculateResults = (
  data: {
    frequency: number;
    permeability: number;
    temperature: number;
    awg: AWGValue;
  },
  material: MaterialKey,
  unit: TemperatureUnit
) => {
  const resistivity = calculateResistivity(
    materialPresets[material].baseResistivity,
    materialPresets[material].tempCoeff,
    data.temperature,
    unit
  );
  const conductivity = 1 / resistivity;
  const skinDepth =
    1 / Math.sqrt(Math.PI * data.frequency * data.permeability * conductivity);
  const strandDiameter = awgData[data.awg] / 1000; // Convert mm to meters
  const n1Max = Math.floor(
    (4 * (skinDepth * skinDepth)) / (strandDiameter * strandDiameter)
  );

  return {
    skinDepth,
    doubleSkinDepth: 2 * skinDepth,
    n1Max,
    resistivity,
  };
};

// Add description at the top of the form
const calculatorDescription = {
  title: "Litz Wire N1 Max Calculator",
  description: `This calculator helps determine the maximum number of strands (N1) in a bundle 
    for Litz wire construction based on skin depth. It's particularly useful for high-frequency 
    applications where skin effect becomes significant, such as in switching power supplies, 
    RF transformers, and inductive charging systems.`,
  frequencyNote: `Operating frequency of your application. Higher frequencies lead to smaller 
    skin depth and fewer allowable strands.`,
  n1MaxNote: `N1 Max represents the maximum number of strands that can be effectively utilized 
    before additional strands become ineffective due to skin effect. This is calculated as 
    (2 × skin depth) ÷ strand diameter.`,
  skinDepthNote: `Skin depth (δ) is a measure of how deeply electrical current penetrates into a conductor at high frequencies. 
    At the skin depth distance, current density decreases to 1/e (about 37%) of its surface value. 
    
    At high frequencies, current tends to flow mainly near the conductor's surface (skin effect), 
    effectively reducing the usable cross-section. This increases AC resistance compared to DC.
    
    Skin depth depends on:
    • Frequency (f): Higher frequency = smaller skin depth
    • Material properties (μ, σ): Permeability and conductivity
    
    Formula: δ = 1/√(π×f×μ×σ)`,
};

export default function N1MaxCalculatorForm() {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>("F");

  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: 1200,
      permeability: materialPresets.copper.permeability,
      temperature: temperatureUnit === "F" ? 68 : 20,
      awg: "18",
    },
    mode: "onChange",
  });

  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialKey>("copper");

  // Handle material preset selection
  const handleMaterialChange = (value: MaterialKey) => {
    setSelectedMaterial(value);
    setValue("permeability", materialPresets[value].permeability);
  };

  const [results, setResults] = useState({
    skinDepth: 0,
    doubleSkinDepth: 0,
    n1Max: 0,
    resistivity: 0,
  });

  // Watch all form values
  const formValues = watch();

  // Handle temperature unit change
  const handleTemperatureUnitChange = (checked: boolean) => {
    const newUnit = checked ? "C" : "F";
    const currentTemp = formValues.temperature;

    // Convert the current temperature value
    const newTemp =
      newUnit === "C"
        ? fahrenheitToCelsius(currentTemp)
        : celsiusToFahrenheit(currentTemp);

    setTemperatureUnit(newUnit);
    setValue("temperature", Math.round(newTemp * 10) / 10); // Round to 1 decimal place
  };

  // Update results whenever form values change
  useEffect(() => {
    const calculateIfValid = () => {
      try {
        if (
          !Number.isNaN(formValues.frequency) &&
          formValues.frequency > 0 &&
          !Number.isNaN(formValues.permeability) &&
          formValues.permeability >= 0 &&
          !Number.isNaN(formValues.temperature) &&
          formValues.temperature >= -459.67 &&
          formValues.awg in awgData
        ) {
          const newResults = calculateResults(
            {
              frequency: Number(formValues.frequency),
              permeability: Number(formValues.permeability),
              temperature: Number(formValues.temperature),
              awg: formValues.awg as AWGValue,
            },
            selectedMaterial,
            temperatureUnit
          );
          setResults(newResults);
        }
      } catch (error) {
        console.error("Calculation error:", error);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculateIfValid, 100);
    return () => clearTimeout(timeoutId);
  }, [formValues, selectedMaterial, temperatureUnit]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{calculatorDescription.title}</h2>
          <p className="text-muted-foreground">
            {calculatorDescription.description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column - Form */}
          <TooltipProvider>
            <form className="space-y-6">
              {/* Material Preset Selector */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="material">Material</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Select a common conductor material to auto-fill
                        properties
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={selectedMaterial}
                  onValueChange={handleMaterialChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(materialPresets).map(([key, material]) => (
                      <SelectItem key={key} value={key}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequency Input - enhanced tooltip */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="frequency">Operating Frequency (f)</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{calculatorDescription.frequencyNote}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="frequency"
                    type="number"
                    className="flex-1"
                    {...register("frequency", { valueAsNumber: true })}
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    Hz
                  </span>
                </div>
                {errors.frequency && (
                  <p className="text-sm text-red-500">
                    {errors.frequency.message}
                  </p>
                )}
              </div>

              {/* Permeability Input - enhanced tooltip */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="permeability">
                    Magnetic Permeability (μ)
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        Magnetic permeability of the conductor material. For
                        most non-magnetic conductors, this is approximately μ₀
                        (4π × 10⁻⁷ H/m).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="permeability"
                    type="number"
                    step="0.000001"
                    className="flex-1"
                    {...register("permeability", { valueAsNumber: true })}
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    H/m
                  </span>
                </div>
                {errors.permeability && (
                  <p className="text-sm text-red-500">
                    {errors.permeability.message}
                  </p>
                )}
              </div>

              {/* Temperature Input with Unit Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>
                          Operating temperature affects the conductor's
                          resistivity. Reference temperatures:
                          {temperatureUnit === "F" ? (
                            <>
                              Room temperature: 68°F
                              <br />
                              Common operating temps: 140°F, 311°F, 356°F
                            </>
                          ) : (
                            <>
                              Room temperature: 20°C
                              <br />
                              Common operating temps: 60°C, 155°C, 180°C
                            </>
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="tempUnit">°F</Label>
                    <Switch
                      id="tempUnit"
                      checked={temperatureUnit === "C"}
                      onCheckedChange={handleTemperatureUnitChange}
                    />
                    <Label htmlFor="tempUnit">°C</Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input
                    id="temperature"
                    type="number"
                    step="1"
                    className="flex-1"
                    {...register("temperature", { valueAsNumber: true })}
                  />
                  <span className="flex items-center text-sm text-muted-foreground">
                    °{temperatureUnit}
                  </span>
                </div>
                {errors.temperature && (
                  <p className="text-sm text-red-500">
                    {errors.temperature.message}
                  </p>
                )}
              </div>

              {/* AWG Strand Selection */}
              <div className="space-y-2">
                <Label htmlFor="awg">AWG Strand Selection</Label>
                <Select
                  defaultValue={watch("awg")}
                  onValueChange={(value) => {
                    register("awg").onChange({
                      target: { name: "awg", value: value },
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AWG" />
                  </SelectTrigger>
                  <SelectContent>
                    {awgOptions.map((awg) => (
                      <SelectItem key={awg} value={awg}>
                        {awg} AWG
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.awg && (
                  <p className="text-sm text-red-500">{errors.awg.message}</p>
                )}
              </div>
            </form>
          </TooltipProvider>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {results.skinDepth > 0 && (
              <>
                {/* Results Card */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <h3 className="mb-4 text-lg font-medium">
                      Results Analysis
                    </h3>
                    <div className="mb-6 rounded-lg bg-orange-50 p-4">
                      <p className="text-2xl font-bold text-orange-600">
                        N1 Max: {results.n1Max}
                      </p>
                      <p className="mt-2 text-sm text-orange-700">
                        Maximum number of strands in the first-level bundle for
                        optimal performance at {formValues.frequency} Hz
                      </p>
                    </div>

                    {/* Add Construction Preview section */}
                    <div className="mb-6 rounded-lg bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Construction Preview
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium">Basic Bundle:</p>
                          <p className="text-sm text-gray-600">
                            {results.n1Max}/{formValues.awg} AWG (
                            {results.n1Max} total strands)
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Common Configurations:</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              5x{results.n1Max}/{formValues.awg} AWG (
                              {5 * results.n1Max} total strands)
                            </p>
                            <p>
                              5x5x{results.n1Max}/{formValues.awg} AWG (
                              {5 * 5 * results.n1Max} total strands)
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        These are common Litz wire configurations using the
                        calculated N1 max. Format is: (bundles per level)x(N1
                        max)/(AWG size)
                      </p>
                    </div>

                    <div className="space-y-4 text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <p className="font-semibold">
                          Skin Depth (δ): {results.skinDepth.toExponential(6)}{" "}
                          meters
                        </p>
                        <p className="text-xs">
                          At this depth, current density drops to 37% of its
                          surface value. For frequencies of{" "}
                          {formValues.frequency} Hz, current mainly flows within{" "}
                          {results.skinDepth.toExponential(3)} meters of the
                          surface.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-semibold">
                          Resistivity at{" "}
                          {temperatureUnit === "F" ? (
                            <>
                              {formValues.temperature}°F (
                              {fahrenheitToCelsius(
                                formValues.temperature
                              ).toFixed(1)}
                              °C)
                            </>
                          ) : (
                            <>
                              {formValues.temperature}°C (
                              {celsiusToFahrenheit(
                                formValues.temperature
                              ).toFixed(1)}
                              °F)
                            </>
                          )}
                          : {results.resistivity.toExponential(6)} Ω⋅m
                        </p>
                        <p className="text-xs">
                          Temperature-adjusted resistivity used in calculations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
