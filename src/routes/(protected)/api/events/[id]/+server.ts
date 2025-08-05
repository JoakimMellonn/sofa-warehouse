import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { event } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const eventId = params.id;
	if (!eventId) {
		return json({ error: true }, { status: 400 });
	}

	const events = await db.select().from(event).where(eq(event.id, eventId));
	return json({ event: events[0] });
};
