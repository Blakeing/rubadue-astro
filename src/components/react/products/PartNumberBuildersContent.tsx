import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";

export default function PartNumberBuildersContent() {
	return (
		<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
			<div className="text-center mb-8 sm:mb-12">
				<h1 className="text-4xl font-bold mb-4 sm:mb-6">
					Part Number Builders
				</h1>
				<p className="text-lg text-muted-foreground">
					Build custom part numbers for Rubadue wire products
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
				<Card className="flex flex-col">
					<CardHeader className="p-4 sm:p-6 lg:p-8">
						<CardTitle>Insulated Winding Wire</CardTitle>
						<CardDescription>
							Build part numbers for insulated winding wire products with
							various insulation types, conductor materials, and specifications.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow p-4 sm:p-6 lg:p-8">
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">Features:</p>
							<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
								<li>Multiple insulation layer options</li>
								<li>Various conductor materials</li>
								<li>AWG size selection (4-40)</li>
								<li>Color coding options</li>
								<li>Insulation thickness specifications</li>
							</ul>
							<div className="pt-4">
								<a href="/part-number-builders/insulated-winding-wire-part-number-builder">
									<Button className="w-full">
										Build Insulated Wire Part Number
									</Button>
								</a>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="flex flex-col">
					<CardHeader>
						<CardTitle>Rubadue Litz Wire</CardTitle>
						<CardDescription>
							Create part numbers for Rubadue Litz wire products with specific
							strand configurations and build options.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="space-y-4">
							<p className="text-sm text-muted-foreground">Features:</p>
							<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
								<li>Multiple strand count options</li>
								<li>AWG size selection (12-50)</li>
								<li>Enamel build specifications</li>
								<li>Magnet wire grade selection</li>
								<li>Optional serve layer configurations</li>
							</ul>
							<div className="pt-4">
								<a href="/part-number-builders/litz-wire-part-number-builder">
									<Button className="w-full">
										Build Litz Wire Part Number
									</Button>
								</a>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-16 text-center">
				<h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					If you need assistance with part number configuration or have specific
					requirements, please contact our technical support team.
				</p>
			</div>
		</div>
	);
}
