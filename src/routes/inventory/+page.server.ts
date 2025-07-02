import { ingredient, type InsertIngredient, type SelectIngredient } from '$lib/server/db/schema';
import { addItemSchema } from '$lib/zod/schema';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod4(addItemSchema));

	let ingredients: SelectIngredient[] = [
		{
			id: 'ceres',
			name: 'Ceres Top',
			amount: 69,
			unit: 'Bottle(s)',
			sizeML: 330
		},
		{
			id: 'royal',
			name: 'Royal Classic',
			amount: 420,
			unit: 'Bottle(s)',
			sizeML: 330
		}
	];

	return {
		form: form,
		ingredients: ingredients
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(addItemSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}

		const existingIngredients = await db
			.select()
			.from(ingredient)
			.where(eq(ingredient.name, form.data.name));

		for (let existingIngredient of existingIngredients) {
			if (existingIngredient.sizeML == form.data.sizeML) {
				console.log('updating existing ingredient');
				await db
					.update(ingredient)
					.set({ amount: existingIngredient.amount + form.data.amount })
					.where(eq(ingredient.id, existingIngredient.id));

				return message(form, 'ingredient updated');
			} else {
				setError(form, 'name', "Can't have multiple items with same name");
				return fail(400, { form });
			}
		}

		const newIngredient: InsertIngredient = {
			name: form.data.name,
			amount: form.data.amount,
			unit: form.data.unit,
			sizeML: form.data.sizeML
		};
		db.insert(ingredient).values(newIngredient);

		return message(form, 'ingredient added');
	}
} satisfies Actions;
