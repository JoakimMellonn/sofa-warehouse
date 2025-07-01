import type { SelectIngredient } from '$lib/server/db/schema';
import { addItemSchema } from '$lib/zod/schema';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

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
			// Return { form } and things will just work.
			return fail(400, { form });
		}

		console.log(form);

		return message(form, 'hello');
	}
} satisfies Actions;
