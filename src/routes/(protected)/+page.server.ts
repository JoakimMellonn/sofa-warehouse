import { db } from '$lib/server/db';
import { drinksToIngredients, event, eventsToDrinks, ingredient } from '$lib/server/db/schema';
import { and, eq, gt, inArray, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import type { IngredientNeed } from '$lib/types/drinks';

export const load: PageServerLoad = async ({}) => {
	const allEvents = await db.select().from(event).orderBy(event.datetime);

	const salesThisYear = await getSales(getCurrentYear());
	const salesLastYear = await getSales(getCurrentYear() - 1);

	const attendanceThisYear = await getAttendance(getCurrentYear());
	const attendanceLastYear = await getAttendance(getCurrentYear() - 1);

	const lowStock = await getLowStock();

	return {
		events: allEvents,
		salesThisYear: salesThisYear,
		salesLastYear: salesLastYear,
		attendanceThisYear: attendanceThisYear,
		attendanceLastYear: attendanceLastYear,
		lowStock: lowStock
	};
};

function getCurrentYear(): number {
	const currentDate = new Date();
	if (currentDate.getMonth() < 8) {
		return currentDate.getFullYear() - 1;
	}
	return currentDate.getFullYear();
}

async function getSales(year: number): Promise<number> {
	const startDate = new Date(year, 8, 1);
	const endDate = new Date(year + 1, 7, 31);
	const events = await db
		.select({ id: event.id })
		.from(event)
		.where(and(gt(event.datetime, startDate), lt(event.datetime, endDate)));

	let sales = 0;
	for (let event of events) {
		const result = await db
			.select({ amountSold: eventsToDrinks.amountSold })
			.from(eventsToDrinks)
			.where(eq(eventsToDrinks.eventId, event.id));
		sales += result.reduce((acc, curr) => acc + curr.amountSold, 0);
	}
	return sales;
}

async function getAttendance(year: number): Promise<number> {
	const startDate = new Date(year, 8, 1);
	const endDate = new Date(year + 1, 7, 31);
	const events = await db
		.select({ numberOfParticipants: event.numberOfParticipants })
		.from(event)
		.where(and(gt(event.datetime, startDate), lt(event.datetime, endDate)));

	return events.reduce((acc, curr) => acc + curr.numberOfParticipants, 0);
}

async function getLowStock(): Promise<IngredientNeed | undefined> {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setFullYear(endDate.getFullYear() - 1);
	const events = await db
		.select({ id: event.id })
		.from(event)
		.where(and(gt(event.datetime, startDate), lt(event.datetime, endDate)));
	const eventIds = events.map((event) => event.id);

	const allEventsToDrinks = await db
		.select()
		.from(eventsToDrinks)
		.where(inArray(eventsToDrinks.eventId, eventIds));
	const drinkIds = allEventsToDrinks.map((eventToDrink) => eventToDrink.drinkId);

	const allDrinksToIngredients = await db
		.select()
		.from(drinksToIngredients)
		.where(inArray(drinksToIngredients.drinkId, drinkIds));
	const ingredientIds = allDrinksToIngredients.map(
		(drinkToIngredient) => drinkToIngredient.ingredientId
	);
	const allIngredients = await db
		.select()
		.from(ingredient)
		.where(inArray(ingredient.id, ingredientIds));
	let mostSoldIngredients = new Map<string, number>();

	for (let eventToDrink of allEventsToDrinks) {
		const drinkToIngredients = allDrinksToIngredients.filter(
			(x) => x.drinkId === eventToDrink.drinkId
		);
		for (let drinkToIngredient of drinkToIngredients) {
			const current = mostSoldIngredients.get(drinkToIngredient.ingredientId);
			if (current) {
				mostSoldIngredients.set(
					drinkToIngredient.ingredientId,
					current + eventToDrink.amountSold * drinkToIngredient.amountML
				);
				continue;
			}
			mostSoldIngredients.set(
				drinkToIngredient.ingredientId,
				eventToDrink.amountSold * drinkToIngredient.amountML
			);
		}
	}

	let ingredientNeed = new Map<string, number>();
	for (let entry of mostSoldIngredients) {
		const ingredient = allIngredients.find((ingredient) => ingredient.id === entry[0]);
		if (!ingredient || !ingredient.amount || !entry[1]) {
			continue;
		}
		ingredientNeed.set(entry[0], ingredient.amount / (entry[1] / ingredient.sizeML));
	}

	const sortedNeed = sortKeysByValue(ingredientNeed);
	const neededIngredient = allIngredients.find((i) => i.id === sortedNeed[0]);
	if (!neededIngredient) return;

	return {
		ingredient: neededIngredient,
		soldLastYear: Math.round(mostSoldIngredients.get(sortedNeed[0])! / neededIngredient.sizeML),
		need: ingredientNeed.get(sortedNeed[0])!
	};
}

function sortKeysByValue(map: Map<string, number>): string[] {
	const values = Array.from(map.values()).sort();

	let result: string[] = [];
	for (let value of values) {
		let key: string | undefined;
		for (const [k, v] of map.entries()) {
			if (v === value) {
				key = k;
				break;
			}
		}
		if (key) {
			result.push(key);
		}
	}
	return result;
}
