import { auth } from '$lib/auth'; // path to your auth file
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id?.startsWith('/(protected)') || event.route.id?.startsWith('/no-access')) {
		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;

			if (session.user.role != 'admin') {
				if (event.route.id?.startsWith('/no-access')) {
					return svelteKitHandler({ event, resolve, auth, building });
				}
				return redirect(307, '/no-access');
			} else if (event.route.id?.startsWith('/no-access')) {
				return redirect(307, '/');
			}

			return svelteKitHandler({ event, resolve, auth, building });
		} else {
			return redirect(307, '/login');
		}
	} else {
		return svelteKitHandler({ event, resolve, auth, building });
	}
};
