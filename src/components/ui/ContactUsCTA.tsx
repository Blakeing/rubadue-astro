import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface ContactUsCTAProps {
	className?: string;
}

export function ContactUsCTA({ className }: ContactUsCTAProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Need Help?</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Have questions about part numbers or need assistance with your wire specifications? Our experts are here to help.
				</p>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button 
						variant="default" 
						className="gap-2"
						onClick={() => window.location.href = '/contact'}
					>
						<Mail className="h-4 w-4" />
						Contact Us
					</Button>
					
					<Button 
						variant="outline" 
						className="gap-2"
						onClick={() => window.location.href = 'tel:+1-970-351-6100'}
					>
						<Phone className="h-4 w-4" />
						Call (970) 351-6100
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
