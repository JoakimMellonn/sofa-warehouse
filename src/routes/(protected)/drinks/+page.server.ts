import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Drink, Ingredient } from '$lib/types/drinks';
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
import { and, eq } from 'drizzle-orm';

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

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}
		console.log(form.data);

		if (form.data.ingredients.length == 0) {
			return fail(400, { form });
		}

		await db.update(drink).set({ name: form.data.name }).where(eq(drink.id, form.data.id));

		const oldRelations = await db
			.select()
			.from(drinksToIngredients)
			.where(eq(drinksToIngredients.drinkId, form.data.id));
		let newIngredients = [...form.data.ingredients];
		for (let ingredient of newIngredients) {
			if (oldRelations.find((v) => v.ingredientId == ingredient.id)) {
				newIngredients.splice(newIngredients.indexOf(ingredient), 1);
			}
		}

		if (newIngredients.length != 0) {
			console.log(newIngredients);

			for (let ingredient of newIngredients) {
				const relation: InsertDrinksToIngredients = {
					drinkId: form.data.id,
					ingredientId: ingredient.id,
					amountML: ingredient.amountML
				};
				await db.insert(drinksToIngredients).values(relation);
			}
		}

		const removedIngredients = [...oldRelations];
		for (let relation of removedIngredients) {
			if (form.data.ingredients.find((v) => v.id == relation.ingredientId)) {
				removedIngredients.splice(removedIngredients.indexOf(relation), 1);
			}
		}

		if (removedIngredients.length != 0) {
			console.log(removedIngredients);

			for (let relation of removedIngredients) {
				await db
					.delete(drinksToIngredients)
					.where(
						and(
							eq(drinksToIngredients.drinkId, form.data.id),
							eq(drinksToIngredients.ingredientId, relation.ingredientId)
						)
					);
			}
		}

		return message(form, '');
	}
} satisfies Actions;
