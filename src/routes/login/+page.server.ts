import { auth } from '$lib/auth';
import { userLoginSchema } from '$lib/zod/schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(userLoginSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(userLoginSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/'
				}
			});
		} catch (error) {
			return setError(form, 'email', JSON.stringify(error));
		}
		return redirect(307, '/');
	}
} satisfies Actions;
