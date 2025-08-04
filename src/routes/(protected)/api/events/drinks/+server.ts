import { db } from '$lib/server/db';
import {
	eventsToDrinks,
	type InsertEventsToDrinks,
	type SelectDrink,
	type SelectEvent
} from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { drinks, event }: { drinks: SelectDrink[]; event: SelectEvent } = await request.json();

	try {
		for (let drink of drinks) {
			const relation: InsertEventsToDrinks = {
				eventId: event.id,
				drinkId: drink.id,
				amountSold: 0
			};
			await db.insert(eventsToDrinks).values(relation);
		}
	} catch (error) {
		return json({ error }, { status: 400 });
	}

	return json({ success: true });
};
