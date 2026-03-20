import fs from "node:fs/promises";
import path from "node:path";

const API_BASE_URL = "https://api.resend.com";
const PAGE_SIZE = 100;
const DEFAULT_OUTPUT_DIR = "exports";
const REQUEST_DELAY_MS = 150;

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function getArgValue(flag) {
	const index = process.argv.indexOf(flag);
	if (index === -1) {
		return undefined;
	}

	return process.argv[index + 1];
}

function hasFlag(flag) {
	return process.argv.includes(flag);
}

function normalizeArrayValue(value) {
	if (!Array.isArray(value)) {
		return value;
	}

	return value.join("; ");
}

function toCsvCell(value) {
	if (value === null || value === undefined) {
		return '""';
	}

	const normalized =
		typeof value === "string"
			? value
			: JSON.stringify(normalizeArrayValue(value), null, 0);

	return `"${normalized.replace(/"/g, '""')}"`;
}

function formatTimestamp(date = new Date()) {
	return date.toISOString().replace(/[:.]/g, "-");
}

async function resendRequest(endpoint, apiKey) {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	});

	if (!response.ok) {
		if (response.status === 429) {
			const retryAfterSeconds = Number(response.headers.get("retry-after") ?? "1");
			await sleep(Math.max(retryAfterSeconds * 1000, 1000));
			return resendRequest(endpoint, apiKey);
		}

		const errorText = await response.text();
		throw new Error(
			`Resend API request failed (${response.status} ${response.statusText}): ${errorText}`,
		);
	}

	await sleep(REQUEST_DELAY_MS);
	return response.json();
}

async function listEmails(apiKey, maxEmails) {
	const emails = [];
	let after;

	while (emails.length < maxEmails) {
		const params = new URLSearchParams({
			limit: String(Math.min(PAGE_SIZE, maxEmails - emails.length)),
		});

		if (after) {
			params.set("after", after);
		}

		const response = await resendRequest(`/emails?${params.toString()}`, apiKey);

		if (!response.data?.length) {
			break;
		}

		emails.push(...response.data);
		after = response.data.at(-1)?.id;

		if (!response.has_more) {
			break;
		}
	}

	return emails;
}

async function getEmailDetails(apiKey, emailId) {
	const response = await resendRequest(`/emails/${emailId}`, apiKey);
	return response;
}

async function mapWithConcurrency(items, worker, concurrency = 5) {
	const results = new Array(items.length);
	let currentIndex = 0;

	async function runWorker() {
		while (currentIndex < items.length) {
			const itemIndex = currentIndex;
			currentIndex += 1;
			results[itemIndex] = await worker(items[itemIndex], itemIndex);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker()),
	);

	return results;
}

async function writeCsv(rows, outputPath) {
	const summaryOnly = hasFlag("--summary-only");
	const readableOnly = hasFlag("--readable-only");
	const headers = summaryOnly
		? ["created_at", "last_event", "subject", "to", "from", "id"]
		: readableOnly
			? ["created_at", "last_event", "subject", "to", "from", "text", "id"]
			: [
					"id",
					"created_at",
					"last_event",
					"from",
					"to",
					"cc",
					"bcc",
					"reply_to",
					"subject",
					"scheduled_at",
					"tags",
					"html",
					"text",
				];

	const lines = [
		headers.join(","),
		...rows.map((row) => headers.map((header) => toCsvCell(row[header])).join(",")),
	];

	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await fs.writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		throw new Error(
			"Missing RESEND_API_KEY. Export it in your shell before running this script.",
		);
	}

	const outputArg = getArgValue("--output");
	const limitArg = getArgValue("--limit");
	const includeContent = !hasFlag("--metadata-only");
	const oldestFirst = hasFlag("--oldest-first");
	const maxEmails = Number(limitArg ?? "1000");

	if (!Number.isFinite(maxEmails) || maxEmails <= 0) {
		throw new Error("--limit must be a positive number.");
	}

	const defaultFilename = `resend-emails-${formatTimestamp()}.csv`;
	const outputPath = path.resolve(
		process.cwd(),
		outputArg ?? path.join(DEFAULT_OUTPUT_DIR, defaultFilename),
	);

	console.log(`Fetching up to ${maxEmails} sent emails from Resend...`);
	const emailReferences = await listEmails(apiKey, maxEmails);
	console.log(`Found ${emailReferences.length} email reference(s).`);

	const rows = includeContent
		? await mapWithConcurrency(
				emailReferences,
				async (emailReference, index) => {
					console.log(
						`Fetching email ${index + 1}/${emailReferences.length}: ${emailReference.id}`,
					);
					const email = await getEmailDetails(apiKey, emailReference.id);

					return {
						id: email.id,
						created_at: email.created_at,
						last_event: email.last_event,
						from: email.from,
						to: normalizeArrayValue(email.to),
						cc: normalizeArrayValue(email.cc),
						bcc: normalizeArrayValue(email.bcc),
						reply_to: normalizeArrayValue(email.reply_to),
						subject: email.subject,
						scheduled_at: email.scheduled_at,
						tags: email.tags,
						html: email.html,
						text: email.text,
					};
				},
				2,
			)
		: emailReferences.map((email) => ({
				id: email.id,
				created_at: email.created_at,
				last_event: email.last_event,
				from: email.from,
				to: normalizeArrayValue(email.to),
				cc: normalizeArrayValue(email.cc),
				bcc: normalizeArrayValue(email.bcc),
				reply_to: normalizeArrayValue(email.reply_to),
				subject: email.subject,
				scheduled_at: email.scheduled_at,
				tags: [],
				html: "",
				text: "",
			}));

	if (oldestFirst) {
		rows.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		);
	}

	await writeCsv(rows, outputPath);
	console.log(`Exported ${rows.length} email(s) to ${outputPath}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
