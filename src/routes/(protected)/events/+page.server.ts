import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/zod/schema';
import { db } from '$lib/server/db';
import { event, type InsertEvent } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod4(eventSchema));

	const events = await db.select().from(event).orderBy(event.datetime);

	return {
		form: form,
		events: events
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(eventSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}

		const newEvent: InsertEvent = {
			name: form.data.name,
			status: form.data.status,
			datetime: form.data.datetime,
			location: form.data.location,
			numberOfParticipants: form.data.numberOfParticipants,
			price: form.data.price.toString()
		};
		const result = await db.insert(event).values(newEvent);
		console.log(result);

		return message(form, 'success');
	}
} satisfies Actions;
