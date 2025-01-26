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

const formSchema = z.object({
  layers: z.string().min(1, "Required"),
  awgSize: z.string().min(1, "Required"),
  conductor: z.string().min(1, "Required"),
  strands: z.string().min(1, "Required"),
  insulation: z.string().min(1, "Required"),
  color: z.string().min(1, "Required"),
  thickness: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof formSchema>;

const layersOptions = [
  { value: "S", label: "Single (1) Basic" },
  { value: "D", label: "Double (2) Supplemental" },
  { value: "T", label: "Triple (3) Reinforced" },
];

const conductorMaterials = [
  { value: "A", label: "TPC" },
  { value: "B", label: "SPC" },
  { value: "C", label: "BS" },
  { value: "D", label: "SPA 135" },
  { value: "E", label: "Enamel" },
  { value: "H", label: "Heavy Enamel" },
  { value: "L", label: "Litz Wire" },
  { value: "N", label: "NPC" },
  { value: "Q", label: "QPN" },
  { value: "S", label: "Stainless Steel" },
];

const strandsOptions = [
  { value: "01", label: "Solid" },
  { value: "07", label: "7 Strands" },
  { value: "19", label: "19 Strands" },
  { value: "37", label: "37 Strands" },
  { value: "65", label: "65 Strands" },
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
  { value: "Z", label: "Special ETFE" },
  { value: "EC", label: "300°C" },
];

const colorCodes = [
  { value: "0", label: "Black" },
  { value: "1", label: "Brown" },
  { value: "2", label: "Red" },
  { value: "3", label: "Orange" },
  { value: "4", label: "Yellow" },
  { value: "5", label: "Green" },
  { value: "6", label: "Blue" },
  { value: "7", label: "Violet" },
  { value: "8", label: "Gray" },
  { value: "9", label: "White" },
  { value: "C", label: "Clear" },
];

const thicknessOptions = [
  { value: "-1", label: '.001"/layer' },
  { value: "-1.5", label: '.0015"/layer' },
  { value: "-2", label: '.002"/layer' },
  { value: "-3", label: '.003"/layer' },
  { value: "-5", label: '.005"/layer' },
];

export default function InsulatedWindingWirePartNumberBuilder() {
  const [partNumber, setPartNumber] = useState("");

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
  });

  const formValues = form.watch();

  useEffect(() => {
    const newPartNumber = `${formValues.layers}${formValues.awgSize}${formValues.conductor}${formValues.strands}${formValues.insulation}${formValues.color}${formValues.thickness}`;
    setPartNumber(newPartNumber);
  }, [formValues]);

  return (
    <div className=" py-16">
      <h1 className="text-3xl font-bold mb-8">
        Insulated Winding Wire Part Number Builder
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              name="awgSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AWG Size (4-40)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter AWG size" {...field} />
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
              name="thickness"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insulation Thickness per Layer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select thickness" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {thicknessOptions.map((option) => (
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

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Generated Part Number</h2>
          <div className="text-2xl font-mono bg-background p-4 rounded border">
            {partNumber || "_ _ _ _ _ _ _"}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Example Part Numbers:
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-mono">T24A01P0XX-2</p>
                <p className="text-sm text-muted-foreground">
                  Triple Insulated, 24 AWG, Tin Plated Copper, Solid Conductor,
                  PFA, Black
                </p>
              </div>
              <div>
                <p className="font-mono">DXX L360/44F6X-3</p>
                <p className="text-sm text-muted-foreground">
                  Double Insulated, Litz Wire, 360/44 Strands/AWG, FEP, Blue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
