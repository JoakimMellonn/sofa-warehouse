import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/zod/schema';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod4(eventSchema));

	return {
		form: form
	};
};

export const actions = {
	defualt: async ({ request }) => {
		const form = await superValidate(request, zod4(eventSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}

		return message(form, 'success');
	}
} satisfies Actions;
