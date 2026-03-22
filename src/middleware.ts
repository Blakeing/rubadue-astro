import { defineMiddleware } from "astro:middleware";
import {
	getDashboardCredentials,
	getSafeDashboardRedirect,
	INTERNAL_DASHBOARD_LOGIN_PATH,
	INTERNAL_DASHBOARD_SESSION_COOKIE,
	isValidDashboardSessionToken,
} from "@/lib/internal-dashboard-auth";

const PROTECTED_PREFIXES = ["/internal", "/api/internal"];
const PUBLIC_INTERNAL_PATHS = new Set([
	INTERNAL_DASHBOARD_LOGIN_PATH,
	"/api/internal/login",
	"/api/internal/logout",
]);
const INTERNAL_CACHE_CONTROL = "no-store, no-cache, must-revalidate, private";

function isProtectedPath(pathname: string) {
	return (
		PROTECTED_PREFIXES.some(
			(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
		) && !PUBLIC_INTERNAL_PATHS.has(pathname)
	);
}

function isInternalApiPath(pathname: string) {
	return pathname === "/api/internal" || pathname.startsWith("/api/internal/");
}

function unauthorizedApiResponse() {
	return new Response(
		JSON.stringify({
			message: "Authentication required",
		}),
		{
			status: 401,
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
}

function applyInternalNoStoreHeaders(response: Response) {
	const headers = new Headers(response.headers);
	headers.set("Cache-Control", INTERNAL_CACHE_CONTROL);
	headers.set("Pragma", "no-cache");
	headers.set("Expires", "0");
	headers.set("Vary", "Cookie");

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

function loginRedirect(request: Request, nextPath: string) {
	const loginUrl = new URL(INTERNAL_DASHBOARD_LOGIN_PATH, request.url);
	loginUrl.searchParams.set("next", nextPath);

	return Response.redirect(loginUrl, 302);
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname, search } = context.url;
	const credentials = getDashboardCredentials(import.meta.env);
	const sessionToken = context.cookies.get(
		INTERNAL_DASHBOARD_SESSION_COOKIE,
	)?.value;
	const isAuthenticated = isValidDashboardSessionToken(
		sessionToken,
		import.meta.env,
	);

	if (pathname === INTERNAL_DASHBOARD_LOGIN_PATH && isAuthenticated) {
		const nextPath = getSafeDashboardRedirect(
			context.url.searchParams.get("next"),
		);
		return applyInternalNoStoreHeaders(
			Response.redirect(new URL(nextPath, context.url), 302),
		);
	}

	if (!isProtectedPath(context.url.pathname)) {
		const response = await next();
		if (
			pathname === INTERNAL_DASHBOARD_LOGIN_PATH ||
			pathname.startsWith("/internal/") ||
			pathname.startsWith("/api/internal/")
		) {
			return applyInternalNoStoreHeaders(response);
		}
		return response;
	}

	if (!credentials) {
		return applyInternalNoStoreHeaders(
			new Response("Dashboard credentials are not configured.", {
				status: 500,
			}),
		);
	}

	if (!isAuthenticated) {
		if (isInternalApiPath(pathname)) {
			return applyInternalNoStoreHeaders(unauthorizedApiResponse());
		}

		return applyInternalNoStoreHeaders(
			loginRedirect(context.request, `${pathname}${search}`),
		);
	}

	return applyInternalNoStoreHeaders(await next());
});
