import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(event.url.origin);
	// const origin = process.env.ORIGIN;
	// if (origin) {
	// 	// Reconstruct the URL with the correct public origin
	// 	const path = event.url.pathname + event.url.search;
	// 	event.url = new URL(path, origin);
	// }
	return resolve(event);
};
