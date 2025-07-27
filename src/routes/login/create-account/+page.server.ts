import { userCreateSchema } from '$lib/zod/schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(userCreateSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(userCreateSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		return redirect(307, '/');
	}
} satisfies Actions;
