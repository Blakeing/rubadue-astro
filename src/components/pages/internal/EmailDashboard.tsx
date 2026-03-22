import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { INTERNAL_DASHBOARD_LOGOUT_EVENT } from "@/lib/internal-dashboard-events";
import {
	QueryClient,
	QueryClientProvider,
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	flexRender,
	getCoreRowModel,
	type ColumnDef,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	Eye,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type StatusFilter = "all" | "bounced" | "delivered" | "suppressed";
type SubmissionTypeFilter = "all" | "quote" | "contact" | "other";

interface DashboardEmail {
	id: string;
	createdAt: string;
	status: string;
	subject: string;
	to: string;
	from: string;
	submitterEmail: string;
	bodyText: string;
}

interface DashboardResponse {
	emails: DashboardEmail[];
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasPreviousPage: boolean;
	hasNextPage: boolean;
	summary: {
		total: number;
		byStatus: Record<string, number>;
	};
}

interface DashboardEmailDetailResponse {
	email: DashboardEmail;
}

type VisiblePageItem =
	| { type: "page"; value: number }
	| { type: "ellipsis"; value: string };

const MAX_PAGE_BUTTONS = 5;
const EMAIL_LIST_QUERY_KEY = "internal-email-list";
const EMAIL_DETAIL_QUERY_KEY = "internal-email-detail";
const PAGE_SIZE_OPTIONS = ["10", "25", "50"] as const;
const DEFAULT_PAGE_SIZE = Number(PAGE_SIZE_OPTIONS[0]);
const INTERNAL_LOGIN_PATH = "/internal/login";

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
	{ label: "All statuses", value: "all" },
	{ label: "Delivered", value: "delivered" },
	{ label: "Suppressed", value: "suppressed" },
	{ label: "Bounced", value: "bounced" },
];

const submissionTypeOptions: Array<{
	label: string;
	value: SubmissionTypeFilter;
}> = [
	{ label: "All types", value: "all" },
	{ label: "Quote", value: "quote" },
	{ label: "Contact", value: "contact" },
	{ label: "Other", value: "other" },
];

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function getBadgeVariant(
	status: string,
): "default" | "secondary" | "destructive" | "outline" {
	switch (status) {
		case "delivered":
			return "default";
		case "suppressed":
			return "secondary";
		case "bounced":
			return "destructive";
		default:
			return "outline";
	}
}

function getStatusBadgeClassName() {
	return "inline-flex min-w-[90px] justify-center whitespace-nowrap";
}

function getSubmissionType(subject: string) {
	const normalizedSubject = subject.toLowerCase();

	if (normalizedSubject.includes("quote request")) {
		return "Quote";
	}

	if (normalizedSubject.includes("contact submission")) {
		return "Contact";
	}

	return "Other";
}

function getSubmissionTypeClassName(subject: string) {
	const baseClassName =
		"inline-flex min-w-[70px] justify-center whitespace-nowrap";

	switch (getSubmissionType(subject)) {
		case "Quote":
			return `${baseClassName} border-blue-200 bg-blue-50 text-blue-700`;
		case "Contact":
			return `${baseClassName} border-emerald-200 bg-emerald-50 text-emerald-700`;
		default:
			return `${baseClassName} border-slate-200 bg-slate-50 text-slate-700`;
	}
}

function getVisiblePageItems(currentPage: number, totalPages: number) {
	if (totalPages <= 1) {
		return [] satisfies VisiblePageItem[];
	}

	const halfWindow = Math.floor(MAX_PAGE_BUTTONS / 2);
	let startPage = Math.max(1, currentPage - halfWindow);
	const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);

	if (endPage - startPage + 1 < MAX_PAGE_BUTTONS) {
		startPage = Math.max(1, endPage - MAX_PAGE_BUTTONS + 1);
	}

	const items: VisiblePageItem[] = [];

	if (startPage > 1) {
		items.push({ type: "page", value: 1 });
		if (startPage > 2) {
			items.push({ type: "ellipsis", value: "start-ellipsis" });
		}
	}

	for (let pageNumber = startPage; pageNumber <= endPage; pageNumber += 1) {
		items.push({ type: "page", value: pageNumber });
	}

	if (endPage < totalPages) {
		if (endPage < totalPages - 1) {
			items.push({ type: "ellipsis", value: "end-ellipsis" });
		}
		items.push({ type: "page", value: totalPages });
	}

	return items;
}

function buildEmailListSearchParams(
	params: {
		page: number;
		pageSize: number;
		statusFilter: StatusFilter;
		typeFilter: SubmissionTypeFilter;
		searchQuery: string;
	},
	forceRefresh = false,
) {
	const searchParams = new URLSearchParams({
		page: String(params.page),
		pageSize: String(params.pageSize),
	});

	if (params.statusFilter !== "all") {
		searchParams.set("status", params.statusFilter);
	}

	if (params.typeFilter !== "all") {
		searchParams.set("type", params.typeFilter);
	}

	if (params.searchQuery) {
		searchParams.set("q", params.searchQuery);
	}

	if (forceRefresh) {
		searchParams.set("refresh", "1");
	}

	return searchParams;
}

async function fetchEmailList(
	params: {
		page: number;
		pageSize: number;
		statusFilter: StatusFilter;
		typeFilter: SubmissionTypeFilter;
		searchQuery: string;
	},
	signal?: AbortSignal,
	forceRefresh = false,
) {
	const response = await fetch(
		`/api/internal/emails?${buildEmailListSearchParams(params, forceRefresh).toString()}`,
		{
			signal,
			cache: "no-store",
		},
	);

	if (response.status === 401) {
		window.location.assign(INTERNAL_LOGIN_PATH);
		throw new Error("Authentication required");
	}

	if (!response.ok) {
		throw new Error(`Failed to load dashboard emails (${response.status})`);
	}

	return (await response.json()) as DashboardResponse;
}

function prefetchEmailListPage(
	queryClient: ReturnType<typeof useQueryClient>,
	params: {
		page: number;
		pageSize: number;
		statusFilter: StatusFilter;
		typeFilter: SubmissionTypeFilter;
		searchQuery: string;
	},
) {
	return queryClient.prefetchQuery({
		queryKey: [EMAIL_LIST_QUERY_KEY, params],
		queryFn: ({ signal }) => fetchEmailList(params, signal),
		staleTime: 30_000,
		gcTime: 5 * 60_000,
	});
}

async function fetchEmailDetail(emailId: string, signal?: AbortSignal) {
	const response = await fetch(
		`/api/internal/emails?id=${encodeURIComponent(emailId)}`,
		{
			signal,
			cache: "no-store",
		},
	);

	if (response.status === 401) {
		window.location.assign(INTERNAL_LOGIN_PATH);
		throw new Error("Authentication required");
	}

	if (!response.ok) {
		throw new Error(`Failed to load email details (${response.status})`);
	}

	const payload = (await response.json()) as DashboardEmailDetailResponse;
	return payload.email;
}

function EmailDashboardContent() {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [typeFilter, setTypeFilter] = useState<SubmissionTypeFilter>("all");
	const [searchInput, setSearchInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
	const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		let isDisposed = false;

		async function verifySession() {
			try {
				const response = await fetch("/api/internal/session", {
					cache: "no-store",
					headers: {
						Accept: "application/json",
					},
				});

				if (!isDisposed && response.status === 401) {
					window.location.assign(INTERNAL_LOGIN_PATH);
				}
			} catch {
				// Ignore transient network issues and let the main queries report them.
			}
		}

		function handlePageShow() {
			void verifySession();
		}

		void verifySession();
		window.addEventListener("pageshow", handlePageShow);

		return () => {
			isDisposed = true;
			window.removeEventListener("pageshow", handlePageShow);
		};
	}, []);

	useEffect(() => {
		function handleDashboardLogout() {
			queryClient.clear();
		}

		window.addEventListener(
			INTERNAL_DASHBOARD_LOGOUT_EVENT,
			handleDashboardLogout,
		);

		return () => {
			window.removeEventListener(
				INTERNAL_DASHBOARD_LOGOUT_EVENT,
				handleDashboardLogout,
			);
		};
	}, [queryClient]);

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			setPage(1);
			setSearchQuery(searchInput.trim());
		}, 300);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [searchInput]);

	const listQueryParams = useMemo(
		() => ({
			page,
			pageSize,
			statusFilter,
			typeFilter,
			searchQuery,
		}),
		[page, pageSize, searchQuery, statusFilter, typeFilter],
	);

	const listQueryKey = useMemo(
		() => [EMAIL_LIST_QUERY_KEY, listQueryParams] as const,
		[listQueryParams],
	);

	const listQuery = useQuery({
		queryKey: listQueryKey,
		queryFn: ({ signal }) => fetchEmailList(listQueryParams, signal),
		placeholderData: keepPreviousData,
		staleTime: 30_000,
		gcTime: 5 * 60_000,
		retry: 1,
	});

	const refreshMutation = useMutation({
		mutationFn: () => fetchEmailList(listQueryParams, undefined, true),
		onSuccess: (data) => {
			queryClient.setQueryData(listQueryKey, data);
			queryClient.removeQueries({
				queryKey: [EMAIL_LIST_QUERY_KEY],
				type: "inactive",
			});
		},
	});

	useEffect(() => {
		if (!listQuery.data) {
			return;
		}

		const adjacentPages: number[] = [];

		if (listQuery.data.hasPreviousPage) {
			adjacentPages.push(listQuery.data.page - 1);
		}

		if (listQuery.data.hasNextPage) {
			adjacentPages.push(listQuery.data.page + 1);
		}

		for (const adjacentPage of adjacentPages) {
			void prefetchEmailListPage(queryClient, {
				...listQueryParams,
				page: adjacentPage,
			});
		}
	}, [listQuery.data, listQueryParams, queryClient]);

	const emails = listQuery.data?.emails ?? [];
	const summary = listQuery.data?.summary.byStatus ?? {};
	const summaryTotal = listQuery.data?.summary.total ?? 0;
	const total = listQuery.data?.total ?? 0;
	const totalPages = listQuery.data?.totalPages ?? 1;
	const currentPage = listQuery.data?.page ?? page;
	const currentPageSize = listQuery.data?.pageSize ?? pageSize;
	const hasPreviousPage = listQuery.data?.hasPreviousPage ?? currentPage > 1;
	const hasNextPage = listQuery.data?.hasNextPage ?? false;
	const isBusy = listQuery.isFetching || refreshMutation.isPending;
	const errorMessage =
		listQuery.error instanceof Error
			? listQuery.error.message
			: refreshMutation.error instanceof Error
				? refreshMutation.error.message
				: null;

	const selectedEmailPreview = useMemo(
		() => emails.find((email) => email.id === selectedEmailId) ?? null,
		[emails, selectedEmailId],
	);

	const detailQuery = useQuery({
		queryKey: [EMAIL_DETAIL_QUERY_KEY, selectedEmailId],
		queryFn: ({ signal }) => fetchEmailDetail(selectedEmailId ?? "", signal),
		enabled: Boolean(selectedEmailId && !selectedEmailPreview?.bodyText),
		staleTime: 5 * 60_000,
		gcTime: 30 * 60_000,
		retry: 1,
	});

	const selectedEmail = detailQuery.data ?? selectedEmailPreview;
	const isRefreshingPage = isBusy && !listQuery.isPending;

	const visiblePages = useMemo(
		() => getVisiblePageItems(currentPage, totalPages),
		[currentPage, totalPages],
	);

	const rangeStart = total === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
	const rangeEnd = total === 0 ? 0 : rangeStart + emails.length - 1;

	const columns = useMemo<ColumnDef<DashboardEmail>[]>(
		() => [
			{
				accessorKey: "createdAt",
				header: "Received",
				size: 190,
				cell: ({ row }) => (
					<div className="whitespace-nowrap text-sm">
						{formatDate(row.original.createdAt)}
					</div>
				),
			},
			{
				accessorKey: "status",
				header: "Status",
				size: 130,
				cell: ({ row }) => (
					<Badge
						variant={getBadgeVariant(row.original.status)}
						className={`${getStatusBadgeClassName()} capitalize`}
					>
						{row.original.status}
					</Badge>
				),
			},
			{
				id: "submissionType",
				header: "Type",
				size: 120,
				cell: ({ row }) => {
					const submissionType = getSubmissionType(row.original.subject);

					return (
						<Badge
							variant="outline"
							className={getSubmissionTypeClassName(row.original.subject)}
						>
							{submissionType}
						</Badge>
					);
				},
			},
			{
				accessorKey: "submitterEmail",
				header: "From",
				size: 320,
				cell: ({ row }) => (
					<div className="break-words text-sm text-muted-foreground">
						{row.original.submitterEmail || "Not available"}
					</div>
				),
			},
			{
				id: "actions",
				header: "Open",
				size: 96,
				cell: ({ row }) => (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open ${row.original.subject}`}
						onClick={(event) => {
							event.stopPropagation();
							setSelectedEmailId(row.original.id);
						}}
					>
						<Eye className="h-4 w-4" />
					</Button>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: emails,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
	});

	function goToPage(nextPage: number) {
		setSelectedEmailId(null);
		setPage(nextPage);
	}

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Total Emails</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{summaryTotal}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Delivered</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{summary.delivered ?? 0}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Suppressed</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{summary.suppressed ?? 0}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Bounced</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-semibold">{summary.bounced ?? 0}</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<div className="w-full sm:w-72">
							<Input
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								placeholder="Search subject or recipient..."
							/>
						</div>
						<div className="w-full sm:w-44">
							<Select
								value={statusFilter}
								onValueChange={(value) => {
									setPage(1);
									setSelectedEmailId(null);
									setStatusFilter(value as StatusFilter);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="w-full sm:w-40">
							<Select
								value={typeFilter}
								onValueChange={(value) => {
									setPage(1);
									setSelectedEmailId(null);
									setTypeFilter(value as SubmissionTypeFilter);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Filter by type" />
								</SelectTrigger>
								<SelectContent>
									{submissionTypeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Button
							type="button"
							variant="outline"
							onClick={() => void refreshMutation.mutateAsync()}
							disabled={isBusy}
						>
							<RefreshCw
								className={`mr-2 h-4 w-4 ${isBusy ? "animate-spin" : ""}`}
							/>
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{errorMessage && (
						<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive mb-6">
							{errorMessage}
						</div>
					)}
					{listQuery.isPending && !listQuery.data ? (
						<div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground mb-6">
							Loading recent email activity...
						</div>
					) : (
						<div className="space-y-3">
							<div className="relative overflow-hidden rounded-md border">
								{isRefreshingPage && (
									<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
										<Loader2 className="size-10 animate-spin text-primary" />
									</div>
								)}
								<Table className="table-fixed">
									<TableHeader>
										{table.getHeaderGroups().map((headerGroup) => (
											<TableRow key={headerGroup.id}>
												{headerGroup.headers.map((header) => (
													<TableHead
														key={header.id}
														className="px-8"
														style={{ width: header.getSize() }}
													>
														{header.isPlaceholder
															? null
															: flexRender(
																	header.column.columnDef.header,
																	header.getContext(),
																)}
													</TableHead>
												))}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows.length > 0 ? (
											table.getRowModel().rows.map((row) => (
												<TableRow
													key={row.id}
													data-state={
														row.original.id === selectedEmailId
															? "selected"
															: undefined
													}
												>
													{row.getVisibleCells().map((cell) => (
														<TableCell
															key={cell.id}
															style={{ width: cell.column.getSize() }}
														>
															{flexRender(
																cell.column.columnDef.cell,
																cell.getContext(),
															)}
														</TableCell>
													))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className="py-8 text-center text-muted-foreground"
												>
													No emails match the current filters.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					)}
					{!errorMessage && total > 0 && (
						<div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1 text-sm text-muted-foreground">
								<p>
									Showing {rangeStart}-{rangeEnd} of {total}
								</p>
								{(statusFilter !== "all" ||
									typeFilter !== "all" ||
									searchQuery) && (
									<p>Filtered from {summaryTotal} total emails.</p>
								)}
							</div>
							<div className="flex flex-col gap-3 sm:ml-auto sm:flex-row sm:items-center">
								<div className="w-full sm:w-32">
									<Select
										value={String(currentPageSize)}
										onValueChange={(value) => {
											setPage(1);
											setSelectedEmailId(null);
											setPageSize(Number(value));
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Rows" />
										</SelectTrigger>
										<SelectContent>
											{PAGE_SIZE_OPTIONS.map((option) => (
												<SelectItem key={option} value={option}>
													{option} / page
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => goToPage(1)}
										disabled={!hasPreviousPage || isBusy}
									>
										First
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => goToPage(currentPage - 1)}
										disabled={!hasPreviousPage || isBusy}
									>
										<ChevronLeft className="mr-1 h-4 w-4" />
										Previous
									</Button>
									<div className="flex items-center gap-1">
										{visiblePages.map((item) =>
											item.type === "ellipsis" ? (
												<span
													key={item.value}
													className="px-2 text-sm text-muted-foreground"
													aria-hidden="true"
												>
													...
												</span>
											) : (
												<Button
													key={item.value}
													type="button"
													variant={
														item.value === currentPage ? "default" : "outline"
													}
													size="icon"
													className="h-8 w-8"
													onClick={() => goToPage(item.value)}
													disabled={isBusy}
												>
													{item.value}
												</Button>
											),
										)}
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => goToPage(currentPage + 1)}
										disabled={!hasNextPage || isBusy}
									>
										Next
										<ChevronRight className="ml-1 h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => goToPage(totalPages)}
										disabled={!hasNextPage || isBusy}
									>
										Last
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			<Sheet
				open={selectedEmailId !== null}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedEmailId(null);
					}
				}}
			>
				<SheetContent
					side="right"
					className="w-full overflow-y-auto sm:max-w-xl lg:max-w-2xl"
				>
					{selectedEmail ? (
						<div className="space-y-6">
							<SheetHeader className="border-b pb-4 pr-8 text-left">
								<div className="flex items-center gap-3">
									<SheetTitle className="text-xl leading-tight">
										{selectedEmail.subject}
									</SheetTitle>
									<Badge
										variant={getBadgeVariant(selectedEmail.status)}
										className="capitalize"
									>
										{selectedEmail.status}
									</Badge>
								</div>
							</SheetHeader>

							<div className="grid gap-4 sm:grid-cols-2">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">Received</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-muted-foreground">
											{formatDate(selectedEmail.createdAt)}
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">From</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="break-all text-sm text-muted-foreground">
											{selectedEmail.submitterEmail ||
												(detailQuery.isPending
													? "Loading..."
													: "Not available")}
										</p>
									</CardContent>
								</Card>
								<Card className="sm:col-span-2">
									<CardHeader className="pb-2">
										<CardTitle className="text-sm">Message</CardTitle>
									</CardHeader>
									<CardContent>
										{detailQuery.error instanceof Error ? (
											<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
												{detailQuery.error.message}
											</div>
										) : detailQuery.isPending && !selectedEmail.bodyText ? (
											<div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
												Loading email body...
											</div>
										) : (
											<pre className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-4 text-sm text-foreground">
												{selectedEmail.bodyText || "No message body available."}
											</pre>
										)}
									</CardContent>
								</Card>
							</div>
						</div>
					) : (
						<div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
							Loading email details...
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}

export function EmailDashboard() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						gcTime: 5 * 60_000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<EmailDashboardContent />
		</QueryClientProvider>
	);
}
