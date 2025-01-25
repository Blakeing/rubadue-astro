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

// Add type for AWG keys
type AWGKey = keyof typeof awgData;

// Add type for material keys
type MaterialKey = keyof typeof materialPresets;

const formSchema = z.object({
  frequency: z.number().min(1, "Frequency must be greater than 0"),
  permeability: z.number().min(0, "Permeability cannot be negative"),
  resistivity: z.number().min(0, "Resistivity cannot be negative"),
  awg: z.string().refine((val): val is AWGKey => val in awgData),
  wireLength: z.number().min(0, "Wire length must be non-negative"),
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
    resistivity: 1.72e-8,
  },
  aluminum: {
    name: "Aluminum",
    permeability: 1.256665e-6,
    resistivity: 2.82e-8,
  },
  silver: {
    name: "Silver",
    permeability: 1.256665e-6,
    resistivity: 1.59e-8,
  },
  gold: {
    name: "Gold",
    permeability: 1.256665e-6,
    resistivity: 2.44e-8,
  },
};

const calculateResults = (data: z.infer<typeof formSchema>) => {
  const conductivity = 1 / data.resistivity;
  const skinDepth =
    1 / Math.sqrt(Math.PI * data.frequency * data.permeability * conductivity);
  // Type assertion since we validated AWG key in schema
  const strandDiameter = awgData[data.awg as AWGKey] / 1000; // Convert mm to meters
  const n1Max = Math.floor((2 * skinDepth) / strandDiameter);

  // Cross-sectional area calculation
  const crossSectionalArea = Math.PI * Math.pow(strandDiameter / 2, 2);

  // Resistance per unit length calculation
  const resistancePerMeter = data.resistivity / crossSectionalArea;

  // Total resistance calculation
  const totalResistance = resistancePerMeter * data.wireLength;

  return {
    skinDepth,
    doubleSkinDepth: 2 * skinDepth,
    n1Max,
    crossSectionalArea,
    resistancePerMeter,
    totalResistance,
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
      resistivity: materialPresets.copper.resistivity,
      awg: "18",
      wireLength: 1,
    },
    mode: "onChange",
  });

  const [selectedMaterial, setSelectedMaterial] = useState("copper");

  // Handle material preset selection
  const handleMaterialChange = (value: MaterialKey) => {
    setSelectedMaterial(value);
    const material = materialPresets[value];
    setValue("permeability", material.permeability);
    setValue("resistivity", material.resistivity);
  };

  const [results, setResults] = useState({
    skinDepth: 0,
    doubleSkinDepth: 0,
    n1Max: 0,
    crossSectionalArea: 0,
    resistancePerMeter: 0,
    totalResistance: 0,
  });

  // Watch all form values
  const formValues = watch();

  // Update results whenever form values change
  useEffect(() => {
    const calculateIfValid = () => {
      try {
        const data = {
          frequency: Number(formValues.frequency),
          permeability: Number(formValues.permeability),
          resistivity: Number(formValues.resistivity),
          awg: formValues.awg,
          wireLength: Number(formValues.wireLength),
        };

        // Only calculate if all values are valid numbers
        if (
          Object.entries(data).every(([key, value]) =>
            key === "awg" ? true : !isNaN(value) && value >= 0
          )
        ) {
          const newResults = calculateResults(data);
          setResults(newResults);
        }
      } catch (error) {
        console.error("Calculation error:", error);
      }
    };

    // Debounce the calculation
    const timeoutId = setTimeout(calculateIfValid, 100);
    return () => clearTimeout(timeoutId);
  }, [formValues]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-bold">{calculatorDescription.title}</h2>
          <p className="text-muted-foreground">
            {calculatorDescription.description}
          </p>
        </div>
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
                      Select a common conductor material to auto-fill properties
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
                <Label htmlFor="permeability">Magnetic Permeability (μ)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Magnetic permeability of the conductor material. For most
                      non-magnetic conductors, this is approximately μ₀ (4π ×
                      10⁻⁷ H/m).
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

            {/* Resistivity Input - enhanced tooltip */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="resistivity">Resistivity (ρ)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Electrical resistivity of the conductor material.
                      Temperature dependence: ρ = ρ₀[1 + α(T - T₀)]
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="resistivity"
                  type="number"
                  step="0.00000001"
                  className="flex-1"
                  {...register("resistivity", { valueAsNumber: true })}
                />
                <span className="flex items-center text-sm text-muted-foreground">
                  Ω⋅m
                </span>
              </div>
              {errors.resistivity && (
                <p className="text-sm text-red-500">
                  {errors.resistivity.message}
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

            {/* Wire Length Input */}
            <div className="space-y-2">
              <Label htmlFor="wireLength">Wire Length (meters)</Label>
              <Input
                id="wireLength"
                type="number"
                step="0.1"
                {...register("wireLength", { valueAsNumber: true })}
              />
              {errors.wireLength && (
                <p className="text-sm text-red-500">
                  {errors.wireLength.message}
                </p>
              )}
            </div>

            {results.skinDepth > 0 && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Results Analysis</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          <p className="font-semibold">
                            Skin Depth (δ): {results.skinDepth.toExponential(6)}{" "}
                            meters
                          </p>
                          <p className="text-xs">
                            At this depth, current density drops to 37% of its
                            surface value. For frequencies of{" "}
                            {formValues.frequency} Hz, current mainly flows
                            within {results.skinDepth.toExponential(3)} meters
                            of the surface, making thicker solid conductors
                            inefficient.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold">
                            Max Recommended Strands (N1 Max): {results.n1Max}
                          </p>
                          <p className="text-xs">
                            {calculatorDescription.n1MaxNote}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold">
                            Cross-Sectional Area:{" "}
                            {results.crossSectionalArea.toExponential(6)} m²
                          </p>
                          <p className="text-xs">
                            Total conductor cross-section for current carrying
                            capacity
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold">
                            DC Resistance:{" "}
                            {results.totalResistance.toExponential(6)} Ω
                          </p>
                          <p className="text-xs">
                            Base resistance without AC effects. AC resistance
                            will be higher due to skin effect.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="p-6">
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            {
                              name: "Wire Diameter",
                              value: awgData[formValues.awg] / 1000,
                              label: "Wire Diameter",
                            },
                            {
                              name: "Skin Depth",
                              value: results.skinDepth,
                              label: "Skin Depth (δ)",
                            },
                            {
                              name: "2× Skin Depth",
                              value: results.doubleSkinDepth,
                              label: "2× Skin Depth",
                            },
                          ]}
                        >
                          <XAxis
                            dataKey="label"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={true}
                          />
                          <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={true}
                            tickFormatter={(value) =>
                              `${value.toExponential(1)}m`
                            }
                          />
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                          />
                          <RechartsTooltip
                            content={({ active, payload }) => {
                              if (active && payload?.[0]) {
                                const data = payload[0];
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        {data.payload.label}
                                      </span>
                                      <span className="font-bold text-muted-foreground">
                                        {typeof data.value === "number"
                                          ? `${data.value.toExponential(6)}m`
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ strokeWidth: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>
                        This chart compares the wire diameter with the skin
                        depth. For effective Litz wire design, individual strand
                        diameter should be less than 2× skin depth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
