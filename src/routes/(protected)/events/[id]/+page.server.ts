import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import {
	drink,
	drinksToIngredients,
	event,
	eventsToDrinks,
	ingredient,
	type SelectIngredient
} from '$lib/server/db/schema';
import type { Drink, DrinkRelation, Ingredient } from '$lib/types/drinks';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const events = await db.select().from(event).where(eq(event.id, id));
	const eventsToDrinksRelations = await db
		.select()
		.from(eventsToDrinks)
		.where(eq(eventsToDrinks.eventId, id));

	const allDrinks = await db.select().from(drink);
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

	return {
		event: events[0],
		drinks: drinkRelations,
		allDrinks: allDrinks
	};
};
