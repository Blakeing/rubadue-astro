import type { APIRoute } from "astro";

const API_BASE_URL = "https://api.resend.com";
const PAGE_SIZE = 100;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;
const LIST_CACHE_TTL_MS = 60_000;
const REQUEST_DELAY_MS = 150;
const MAX_CONCURRENCY = 3;

type EmailStatus =
	| "bounced"
	| "clicked"
	| "complained"
	| "delivered"
	| "opened"
	| "sent"
	| "suppressed";

type SubmissionType = "quote" | "contact" | "other";

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

interface ResendListEmail {
	id: string;
	created_at: string;
	last_event: string;
	subject: string;
	to: string[];
	from: string;
}

interface ResendListResponse {
	data: ResendListEmail[];
	has_more?: boolean;
}

interface ResendEmailDetail {
	id: string;
	created_at: string;
	last_event: string;
	subject: string;
	to: string[];
	from: string;
	text: string | null;
	html: string | null;
}

let cachedEmailReferences:
	| {
			apiKey: string;
			expiresAt: number;
			data: ResendListEmail[];
	  }
	| undefined;

function normalizeEmailDetail(email: ResendEmailDetail): DashboardEmail {
	const bodyText = createBodyText(email.text, email.html);

	return {
		id: email.id,
		createdAt: email.created_at,
		status: email.last_event,
		subject: email.subject,
		to: normalizeArray(email.to),
		from: email.from,
		submitterEmail: extractSubmitterEmail(bodyText),
		bodyText,
	};
}

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function normalizeArray(value: string[] | null | undefined) {
	return Array.isArray(value) ? value.join(", ") : "";
}

function stripHtml(html: string) {
	return html
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/\s+/g, " ")
		.trim();
}

function createBodyText(
	text: string | null | undefined,
	html: string | null | undefined,
) {
	return text?.trim() || (html ? stripHtml(html) : "");
}

function extractSubmitterEmail(bodyText: string) {
	const match = bodyText.match(/^Email:\s*(.+)$/m);
	return match?.[1]?.trim() ?? "";
}

async function mapWithConcurrency<TInput, TOutput>(
	items: TInput[],
	worker: (item: TInput) => Promise<TOutput>,
	concurrency: number,
) {
	const results = new Array<TOutput>(items.length);
	let currentIndex = 0;

	async function runWorker() {
		while (currentIndex < items.length) {
			const itemIndex = currentIndex;
			currentIndex += 1;
			results[itemIndex] = await worker(items[itemIndex]);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, items.length) }, () =>
			runWorker(),
		),
	);

	return results;
}

async function resendRequest<TResponse>(endpoint: string, apiKey: string) {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	if (!response.ok) {
		if (response.status === 429) {
			const retryAfterSeconds = Number(
				response.headers.get("retry-after") ?? "1",
			);
			await sleep(Math.max(retryAfterSeconds * 1000, 1000));
			return resendRequest<TResponse>(endpoint, apiKey);
		}

		const errorText = await response.text();
		throw new Error(
			`Resend API request failed (${response.status} ${response.statusText}): ${errorText}`,
		);
	}

	await sleep(REQUEST_DELAY_MS);
	return (await response.json()) as TResponse;
}

async function getEmailWithRetry(apiKey: string, emailId: string) {
	try {
		return await resendRequest<ResendEmailDetail>(`/emails/${emailId}`, apiKey);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message.toLowerCase().includes("too many requests")
		) {
			await sleep(1000);
			return resendRequest<ResendEmailDetail>(`/emails/${emailId}`, apiKey);
		}

		throw error;
	}
}

function matchesSearch(email: ResendListEmail, searchQuery: string) {
	if (!searchQuery) {
		return true;
	}

	const haystack = [
		email.subject,
		email.from,
		normalizeArray(email.to),
		email.id,
	]
		.join(" ")
		.toLowerCase();

	return haystack.includes(searchQuery);
}

function getSubmissionType(subject: string): SubmissionType {
	const normalizedSubject = subject.toLowerCase();

	if (normalizedSubject.includes("quote request")) {
		return "quote";
	}

	if (normalizedSubject.includes("contact submission")) {
		return "contact";
	}

	return "other";
}

async function listEmailReferences(apiKey: string, forceRefresh = false) {
	if (
		!forceRefresh &&
		cachedEmailReferences &&
		cachedEmailReferences.apiKey === apiKey &&
		cachedEmailReferences.expiresAt > Date.now()
	) {
		return cachedEmailReferences.data;
	}

	const emails: ResendListEmail[] = [];
	let after: string | undefined;

	while (true) {
		const params = new URLSearchParams({
			limit: String(PAGE_SIZE),
		});

		if (after) {
			params.set("after", after);
		}

		const response = await resendRequest<ResendListResponse>(
			`/emails?${params.toString()}`,
			apiKey,
		);

		if (!response.data?.length) {
			break;
		}

		emails.push(...response.data);

		if (!response.has_more) {
			break;
		}

		after = response.data.at(-1)?.id;
		if (!after) {
			break;
		}
	}

	cachedEmailReferences = {
		apiKey,
		expiresAt: Date.now() + LIST_CACHE_TTL_MS,
		data: emails,
	};

	return emails;
}

export const GET: APIRoute = async ({ url }) => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	const emailId = url.searchParams.get("id");
	const pageParam = Number(url.searchParams.get("page") ?? DEFAULT_PAGE);
	const page = Number.isFinite(pageParam)
		? Math.max(Math.floor(pageParam), 1)
		: DEFAULT_PAGE;
	const pageSizeParam = Number(
		url.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE,
	);
	const pageSize = Number.isFinite(pageSizeParam)
		? Math.min(Math.max(Math.floor(pageSizeParam), 1), MAX_PAGE_SIZE)
		: DEFAULT_PAGE_SIZE;
	const statusFilter = url.searchParams.get("status")?.toLowerCase() as
		| EmailStatus
		| undefined;
	const typeFilter = url.searchParams.get("type")?.toLowerCase() as
		| SubmissionType
		| undefined;
	const searchQuery = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
	const forceRefresh = url.searchParams.get("refresh") === "1";

	try {
		if (emailId) {
			const email = await getEmailWithRetry(apiKey, emailId);

			return new Response(
				JSON.stringify({ email: normalizeEmailDetail(email) }),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const emailReferences = await listEmailReferences(apiKey, forceRefresh);
		const overallSummary = emailReferences.reduce<Record<string, number>>(
			(acc, email) => {
				acc[email.last_event] = (acc[email.last_event] ?? 0) + 1;
				return acc;
			},
			{},
		);

		const filteredEmailReferences = emailReferences.filter(
			(email) =>
				(!statusFilter || email.last_event === statusFilter) &&
				(!typeFilter || getSubmissionType(email.subject) === typeFilter) &&
				matchesSearch(email, searchQuery),
		);
		const total = filteredEmailReferences.length;
		const totalPages = Math.max(Math.ceil(total / pageSize), 1);
		const safePage = Math.min(page, totalPages);
		const pageStartIndex = (safePage - 1) * pageSize;
		const currentPageReferences = filteredEmailReferences.slice(
			pageStartIndex,
			pageStartIndex + pageSize,
		);

		const emails = await mapWithConcurrency(
			currentPageReferences,
			async (emailReference) => {
				const email = await getEmailWithRetry(apiKey, emailReference.id);
				return normalizeEmailDetail(email);
			},
			MAX_CONCURRENCY,
		);

		return new Response(
			JSON.stringify({
				emails,
				page: safePage,
				pageSize,
				total,
				totalPages,
				hasPreviousPage: safePage > 1,
				hasNextPage: safePage < totalPages,
				summary: {
					total: emailReferences.length,
					byStatus: overallSummary,
				},
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "An error occurred while loading dashboard emails",
				error: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
