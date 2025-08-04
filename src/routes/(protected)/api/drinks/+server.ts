import { db } from '$lib/server/db';
import {
	drink,
	drinksToIngredients,
	ingredient,
	type SelectIngredient
} from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Drink, Ingredient } from '$lib/types/drinks';

export const GET: RequestHandler = async () => {
	const ingredients: SelectIngredient[] = await db.select().from(ingredient);

	let drinks: Drink[] = [];
	const allDrinks = await db.select().from(drink);
	for (let drink of allDrinks) {
		const relations = await db
			.select()
			.from(drinksToIngredients)
			.where(eq(drinksToIngredients.drinkId, drink.id));

		let drinkIngredients: Ingredient[] = [];
		for (let relation of relations) {
			let ingredient = ingredients.find((v) => v.id === relation.ingredientId);
			if (!ingredient) {
				continue;
			}
			drinkIngredients.push({ ingredient: ingredient, amountMl: relation.amountML });
		}

		let newDrink: Drink = {
			drink: drink,
			ingredients: drinkIngredients
		};
		drinks.push(newDrink);
	}

	return json({ ingredients, drinks });
};
