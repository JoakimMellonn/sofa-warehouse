import { db } from '$lib/server/db';
import {
	drink,
	drinksToIngredients,
	eventsToDrinks,
	ingredient,
	type InsertEventsToDrinks,
	type SelectDrink,
	type SelectIngredient
} from '$lib/server/db/schema';
import type { Drink, DrinkRelation, Ingredient } from '$lib/types/drinks';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const eventId = params.id;
	if (!eventId) {
		return json({ error: true }, { status: 400 });
	}

	const eventsToDrinksRelations = await db
		.select()
		.from(eventsToDrinks)
		.where(eq(eventsToDrinks.eventId, eventId));
	const ingredients: SelectIngredient[] = await db.select().from(ingredient);
	let drinkRelations: DrinkRelation[] = [];

	for (let relation of eventsToDrinksRelations) {
		const relations = await db
			.select()
			.from(drinksToIngredients)
			.where(eq(drinksToIngredients.drinkId, relation.drinkId));

		let drinkIngredients: Ingredient[] = [];
		for (let relation of relations) {
			let ingredient = ingredients.find((v) => v.id === relation.ingredientId);
			if (!ingredient) {
				continue;
			}
			drinkIngredients.push({ ingredient: ingredient, amountMl: relation.amountML });
		}

		const drinks = await db.select().from(drink).where(eq(drink.id, relation.drinkId));
		let newDrink: Drink = {
			drink: drinks[0],
			ingredients: drinkIngredients
		};
		drinkRelations.push({ drink: newDrink, amountSold: relation.amountSold });
	}

	return json({
		drinks: drinkRelations
	});
};

export const POST: RequestHandler = async ({ request, params }) => {
	const eventId = params.id;
	if (!eventId) {
		return json({ error: true }, { status: 400 });
	}

	const { drinks }: { drinks: SelectDrink[] } = await request.json();

	try {
		for (let drink of drinks) {
			const relation: InsertEventsToDrinks = {
				eventId: eventId,
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

export const DELETE: RequestHandler = async ({ request, params }) => {
	const eventId = params.id;
	if (!eventId) {
		return json({ error: true }, { status: 400 });
	}

	const { drinks }: { drinks: SelectDrink[] } = await request.json();

	for (let drink of drinks) {
		await db.delete(eventsToDrinks).where(eq(eventsToDrinks.drinkId, drink.id));
	}

	return json({ success: true });
};
