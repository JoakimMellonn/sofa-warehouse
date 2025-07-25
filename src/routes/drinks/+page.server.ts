import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Drink, Ingredient } from './drinks';
import { drinkSchema } from '$lib/zod/schema';
import {
	drink,
	drinksToIngredients,
	ingredient,
	type InsertDrink,
	type InsertDrinksToIngredients,
	type SelectIngredient
} from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod4(drinkSchema));

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

	return {
		form: form,
		drinks: drinks,
		ingredients: ingredients
	};
};

export const actions = {
	addDrink: async ({ request }) => {
		const form = await superValidate(request, zod4(drinkSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}
		console.log(form.data);

		if (form.data.ingredients.length == 0) {
			return fail(400, { form });
		}

		const existingDrinks = await db.select().from(drink).where(eq(drink.name, form.data.name));
		if (existingDrinks.length > 0) {
			return setError(form, 'name', "Can't have multiple drinks");
		}

		const insertDrink: InsertDrink = {
			name: form.data.name
		};
		await db.insert(drink).values(insertDrink);
		const newDrink = (await db.select().from(drink).where(eq(drink.name, form.data.name)))[0];

		for (let ingredient of form.data.ingredients) {
			const relation: InsertDrinksToIngredients = {
				drinkId: newDrink.id,
				ingredientId: ingredient.id,
				amountML: ingredient.amountML
			};
			await db.insert(drinksToIngredients).values(relation);
		}

		return message(form, 'success');
	},
	updateDrink: async ({ request }) => {
		const form = await superValidate(request, zod4(drinkSchema));

		return message(form, '');
	}
} satisfies Actions;
