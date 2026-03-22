import {
	createHash,
	createHmac,
	randomBytes,
	timingSafeEqual,
} from "node:crypto";

export const INTERNAL_DASHBOARD_LOGIN_PATH = "/internal/login";
export const INTERNAL_DASHBOARD_DEFAULT_PATH = "/internal/emails";
export const INTERNAL_DASHBOARD_SESSION_COOKIE = "internal_dashboard_session";
export const INTERNAL_DASHBOARD_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

interface DashboardCredentials {
	username: string;
	password: string;
}

type EnvLike = {
	INTERNAL_DASHBOARD_USERNAME?: string;
	INTERNAL_DASHBOARD_PASSWORD?: string;
	PROD?: boolean;
};

export function getDashboardCredentials(
	env: EnvLike,
): DashboardCredentials | null {
	const username = env.INTERNAL_DASHBOARD_USERNAME;
	const password = env.INTERNAL_DASHBOARD_PASSWORD;

	if (!username || !password) {
		return null;
	}

	return { username, password };
}

function getDashboardSessionSecret(credentials: DashboardCredentials) {
	return createHash("sha256")
		.update(`${credentials.username}:${credentials.password}`)
		.digest("hex");
}

export function createDashboardSessionToken(credentials: DashboardCredentials) {
	const expiresAt = Date.now() + INTERNAL_DASHBOARD_SESSION_MAX_AGE * 1000;
	const payload = JSON.stringify({
		expiresAt,
		sessionId: randomBytes(16).toString("hex"),
	});
	const encodedPayload = Buffer.from(payload).toString("base64url");
	const signature = createHmac("sha256", getDashboardSessionSecret(credentials))
		.update(encodedPayload)
		.digest("base64url");

	return `${encodedPayload}.${signature}`;
}

export function isValidDashboardSessionToken(
	sessionToken: string | undefined,
	env: EnvLike,
) {
	const credentials = getDashboardCredentials(env);
	if (!credentials || !sessionToken) {
		return false;
	}

	const [encodedPayload, signature] = sessionToken.split(".");
	if (!encodedPayload || !signature) {
		return false;
	}

	const expectedSignature = createHmac(
		"sha256",
		getDashboardSessionSecret(credentials),
	)
		.update(encodedPayload)
		.digest("base64url");

	if (signature.length !== expectedSignature.length) {
		return false;
	}

	const isSignatureValid = timingSafeEqual(
		new TextEncoder().encode(signature),
		new TextEncoder().encode(expectedSignature),
	);

	if (!isSignatureValid) {
		return false;
	}

	try {
		const payload = JSON.parse(
			Buffer.from(encodedPayload, "base64url").toString("utf8"),
		) as {
			expiresAt?: number;
		};

		return (
			typeof payload.expiresAt === "number" && payload.expiresAt > Date.now()
		);
	} catch {
		return false;
	}
}

export function getSafeDashboardRedirect(next: string | null | undefined) {
	if (!next) {
		return INTERNAL_DASHBOARD_DEFAULT_PATH;
	}

	if (!next.startsWith("/")) {
		return INTERNAL_DASHBOARD_DEFAULT_PATH;
	}

	if (next.startsWith("//")) {
		return INTERNAL_DASHBOARD_DEFAULT_PATH;
	}

	if (!next.startsWith("/internal")) {
		return INTERNAL_DASHBOARD_DEFAULT_PATH;
	}

	if (next.startsWith(INTERNAL_DASHBOARD_LOGIN_PATH)) {
		return INTERNAL_DASHBOARD_DEFAULT_PATH;
	}

	return next;
}

export function getDashboardSessionCookieOptions(env: EnvLike) {
	return {
		httpOnly: true,
		path: "/",
		sameSite: "lax" as const,
		secure: Boolean(env.PROD),
		maxAge: INTERNAL_DASHBOARD_SESSION_MAX_AGE,
	};
}
