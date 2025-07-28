import { auth } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const users = await auth.api.listUsers({
		query: {
			limit: 1000
		},
		headers: request.headers
	});
	return { users: users.users };
};
