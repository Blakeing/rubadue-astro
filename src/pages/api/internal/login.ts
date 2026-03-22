import type { APIRoute } from "astro";
import {
	createDashboardSessionToken,
	getDashboardCredentials,
	getDashboardSessionCookieOptions,
	getSafeDashboardRedirect,
	INTERNAL_DASHBOARD_DEFAULT_PATH,
	INTERNAL_DASHBOARD_LOGIN_PATH,
	INTERNAL_DASHBOARD_SESSION_COOKIE,
} from "@/lib/internal-dashboard-auth";

export const POST: APIRoute = async ({ request, cookies }) => {
	const credentials = getDashboardCredentials(import.meta.env);
	if (!credentials) {
		return new Response("Dashboard credentials are not configured.", {
			status: 500,
		});
	}

	const formData = await request.formData();
	const username = String(formData.get("username") ?? "");
	const password = String(formData.get("password") ?? "");
	const nextPath = getSafeDashboardRedirect(String(formData.get("next") ?? ""));

	if (
		username !== credentials.username ||
		password !== credentials.password
	) {
		const loginUrl = new URL(INTERNAL_DASHBOARD_LOGIN_PATH, request.url);
		loginUrl.searchParams.set("error", "invalid");
		loginUrl.searchParams.set("next", nextPath || INTERNAL_DASHBOARD_DEFAULT_PATH);
		if (username) {
			loginUrl.searchParams.set("username", username);
		}

		return Response.redirect(loginUrl, 302);
	}

	cookies.set(
		INTERNAL_DASHBOARD_SESSION_COOKIE,
		createDashboardSessionToken(credentials),
		getDashboardSessionCookieOptions(import.meta.env),
	);

	return Response.redirect(new URL(nextPath, request.url), 302);
};
