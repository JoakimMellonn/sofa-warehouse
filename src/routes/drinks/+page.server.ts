import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Drink } from './drinks';
import { drinkSchema } from '$lib/zod/schema';
import { ingredient, type SelectIngredient } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod4(drinkSchema));

	const drinks: Drink[] = [];
	const ingredients: SelectIngredient[] = await db.select().from(ingredient);

	return {
		form: form,
		drinks: drinks,
		ingredients: ingredients
	};
};

export const actions = {
	addDrink: async ({ request }) => {
		console.log(request.body);

		const form = await superValidate(request, zod4(drinkSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}

		console.log(form.data);

		return message(form, '');
	},
	updateItem: async ({ request }) => {
		const form = await superValidate(request, zod4(drinkSchema));

		return message(form, '');
	}
} satisfies Actions;
