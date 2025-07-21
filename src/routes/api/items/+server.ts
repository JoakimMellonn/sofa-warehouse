import { db } from '$lib/server/db';
import { ingredient } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { inArray } from 'drizzle-orm';

export const GET: RequestHandler = async () => {
	const ingredients = await db.select().from(ingredient);

	return json({ ingredients });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { rows }: { rows: any[] } = await request.json();

	const ids = rows.map((row) => row.original.id);

	await db.update(ingredient).set({ amount: 0 }).where(inArray(ingredient.id, ids));

	return json({ message: 'success' });
};
