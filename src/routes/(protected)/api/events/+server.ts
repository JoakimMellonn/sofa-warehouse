import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const events = await db.select().from(event).orderBy(event.datetime);

	return json({ events });
};
