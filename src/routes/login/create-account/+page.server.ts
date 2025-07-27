import { auth } from '$lib/auth';
import { userCreateSchema } from '$lib/zod/schema';
import { type Actions } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
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

		if (form.data.password !== form.data.confirmPassword) {
			return setError(form, 'confirmPassword', 'Passwords do not match');
		}

		try {
			await auth.api.signUpEmail({
				body: {
					name: `${form.data.firstName} ${form.data.lastName}`,
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/'
				}
			});
		} catch (error) {
			return setError(form, 'email', JSON.stringify(error));
		}
	}
} satisfies Actions;
