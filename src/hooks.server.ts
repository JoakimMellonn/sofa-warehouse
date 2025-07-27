import { auth } from '$lib/auth'; // path to your auth file
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id?.startsWith('/(protected)')) {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (session) {
			event.locals.session = session?.session;
			event.locals.user = session?.user;

			return svelteKitHandler({ event, resolve, auth, building });
		} else {
			redirect(307, '/login');
		}
	} else {
		return svelteKitHandler({ event, resolve, auth, building });
	}
};
