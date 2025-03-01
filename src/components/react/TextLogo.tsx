import { cn } from "@/lib/utils";

interface TextLogoProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
}

export function TextLogo({ className, ...props }: TextLogoProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlSpace="preserve"
			viewBox="0.68 41.5 236.42 18.74"
			className={cn("h-5 w-auto text-foreground", className)}
			{...props}
		>
			<title>Rubadue Wire</title>
			<style>
				{`
          .st0 {
            fill: currentColor;
          }
          .st1 {
            fill: #c06536;
          }
        `}
			</style>
			<path
				d="M44.57 51.68c0 2.96-.89 5.12-2.67 6.49-1.56 1.19-3.88 1.78-6.95 1.78h-1.1c-3.07 0-5.38-.59-6.95-1.78-1.78-1.36-2.67-3.53-2.67-6.49V41.56h3.2v10.12c0 2.21.76 3.67 2.29 4.39.99.45 2.73.67 5.22.67 2.08 0 3.61-.31 4.58-.94 1.22-.79 1.83-2.16 1.83-4.12V41.56h3.2v10.12zM68.4 54.59c0 .79-.2 1.54-.59 2.23-1.18 2.06-3.43 3.1-6.73 3.1H47.89V41.53h13.19c3.14 0 5.34.98 6.6 2.93.49.79.73 1.63.73 2.53 0 1.53-.65 2.81-1.94 3.85 1.28 1.01 1.93 2.26 1.93 3.75zm-3.1-7.62c0-.77-.45-1.37-1.35-1.78-.7-.3-1.5-.46-2.4-.46H51.09v11.98h10.47c.88 0 1.66-.13 2.34-.4.93-.39 1.4-.96 1.4-1.7 0-.75-.47-1.33-1.4-1.72-.7-.29-1.48-.43-2.34-.43h-8.59v-3.2h8.59c.9 0 1.7-.16 2.4-.48.9-.42 1.34-1.02 1.34-1.81zM92.9 59.95l-4.12-.03-3.1-5.14h-8.72l1.94-3.18h4.87l-3.2-5.3-8.29 13.62h-4.12l9.99-16.61c.25-.43.6-.83 1.05-1.19.54-.41 1.02-.62 1.45-.62.47 0 .95.2 1.45.59.43.34.78.75 1.05 1.21l9.75 16.65zM113.73 50.55c0 2.71-.88 4.95-2.62 6.73-1.75 1.78-3.96 2.66-6.64 2.66H94.1V41.56h10.37c2.71 0 4.93.82 6.66 2.48 1.73 1.65 2.6 3.82 2.6 6.51zm-3.21.27c0-1.78-.57-3.23-1.71-4.36-1.14-1.13-2.59-1.7-4.35-1.7h-7.19v11.98h7.19c1.76 0 3.21-.55 4.35-1.64 1.14-1.1 1.71-2.52 1.71-4.28zM136.21 51.68c0 2.96-.89 5.12-2.67 6.49-1.56 1.19-3.88 1.78-6.95 1.78h-1.1c-3.07 0-5.38-.59-6.95-1.78-1.78-1.36-2.66-3.53-2.66-6.49V41.56h3.2v10.12c0 2.21.76 3.67 2.29 4.39.99.45 2.73.67 5.22.67 2.08 0 3.61-.31 4.58-.94 1.22-.79 1.83-2.16 1.83-4.12V41.56h3.21v10.12zM155.35 59.95h-15.88V41.56h15.88v3.2h-12.68v11.98h12.68v3.21zm-.83-7.73h-10.5v-3.2h10.5v3.2zM23.74 59.94l-7.66-7.64c1.3-.23 2.34-.7 3.18-1.43 1.25-1.09 1.94-2.32 1.94-3.85 0-.9-.24-1.74-.73-2.53-1.26-1.96-3.46-2.93-6.6-2.93H.68v18.39h3.2V44.76h10.47c.9 0 1.7.15 2.4.46.9.41 1.35 1 1.35 1.78 0 .79-.45 1.39-1.35 1.8-.7.32-1.5.49-2.4.49H5.77v3.2h5.81l7.43 7.45h4.73z"
				className="st0"
			/>
			<path
				d="m187.25 41.56-9.48 16.88c-.66 1.2-1.33 1.8-1.99 1.8-.66 0-1.33-.6-1.99-1.8l-2.58-4.71-2.64 4.71c-.66 1.2-1.33 1.8-1.99 1.8-.67 0-1.33-.6-1.99-1.8l-9.23-16.88h4.12l7.19 13.38 2.58-4.82-4.68-8.56h4.12l7.19 13.38 7.27-13.38h4.1zM192.2 59.95H189V41.56h3.21v18.39zM237.1 59.95h-15.88V41.56h15.88v3.2h-12.68v11.98h12.68v3.21zm-.84-7.73h-10.5v-3.2h10.5v3.2zM219.48 59.94l-7.66-7.64c1.3-.23 2.34-.7 3.17-1.43 1.25-1.09 1.94-2.32 1.94-3.85 0-.9-.24-1.74-.73-2.53-1.26-1.96-3.46-2.93-6.6-2.93h-13.19v18.39h3.2V44.76h10.47c.9 0 1.7.15 2.4.46.9.41 1.35 1 1.35 1.78 0 .79-.45 1.39-1.35 1.8-.7.32-1.5.49-2.4.49h-8.59v3.2h5.81l7.43 7.45h4.75z"
				className="st1"
			/>
		</svg>
	);
}
