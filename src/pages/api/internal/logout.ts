import type { APIRoute } from "astro";
import {
	getDashboardSessionCookieOptions,
	INTERNAL_DASHBOARD_LOGIN_PATH,
	INTERNAL_DASHBOARD_SESSION_COOKIE,
} from "@/lib/internal-dashboard-auth";

export const POST: APIRoute = async ({ request, cookies }) => {
	cookies.delete(
		INTERNAL_DASHBOARD_SESSION_COOKIE,
		getDashboardSessionCookieOptions(import.meta.env),
	);

	if (request.headers.get("accept")?.includes("application/json")) {
		return new Response(
			JSON.stringify({
				redirectTo: INTERNAL_DASHBOARD_LOGIN_PATH,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}

	return Response.redirect(new URL(INTERNAL_DASHBOARD_LOGIN_PATH, request.url), 302);
};
