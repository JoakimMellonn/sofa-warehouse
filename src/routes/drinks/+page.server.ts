import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
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
