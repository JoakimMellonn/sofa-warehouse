import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import {
	drink,
	drinksToIngredients,
	event,
	eventsToDrinks,
	ingredient,
	type SelectIngredient
} from '$lib/server/db/schema';
import type { Drink, DrinkRelation, Ingredient } from '$lib/types/drinks';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/zod/schema';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;

	const events = await db.select().from(event).where(eq(event.id, id));
	const eventsToDrinksRelations = await db
		.select()
		.from(eventsToDrinks)
		.where(eq(eventsToDrinks.eventId, id));

	const allDrinks = await db.select().from(drink);
	const ingredients: SelectIngredient[] = await db.select().from(ingredient);
	let drinkRelations: DrinkRelation[] = [];

	for (let relation of eventsToDrinksRelations) {
		const relations = await db
			.select()
			.from(drinksToIngredients)
			.where(eq(drinksToIngredients.drinkId, relation.drinkId));

		let drinkIngredients: Ingredient[] = [];
		for (let relation of relations) {
			let ingredient = ingredients.find((v) => v.id === relation.ingredientId);
			if (!ingredient) {
				continue;
			}
			drinkIngredients.push({ ingredient: ingredient, amountMl: relation.amountML });
		}

		const drinks = await db.select().from(drink).where(eq(drink.id, relation.drinkId));
		let newDrink: Drink = {
			drink: drinks[0],
			ingredients: drinkIngredients
		};
		drinkRelations.push({ drink: newDrink, amountSold: relation.amountSold });
	}

	const form = await superValidate(zod4(eventSchema));
	form.data.id = events[0].id;
	form.data.name = events[0].name;
	form.data.status = events[0].status;
	form.data.datetime = events[0].datetime;
	form.data.location = events[0].location;
	form.data.numberOfParticipants = events[0].numberOfParticipants;
	form.data.price = +events[0].price;

	return {
		form: form,
		event: events[0],
		drinks: drinkRelations,
		allDrinks: allDrinks
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(eventSchema));

		if (!form.valid) {
			console.log(form.errors);
			return fail(400, { form });
		}

		const updatedEvent = {
			name: form.data.name,
			status: form.data.status,
			datetime: form.data.datetime,
			location: form.data.location,
			numberOfParticipants: form.data.numberOfParticipants,
			price: form.data.price.toString()
		};
		await db.update(event).set(updatedEvent).where(eq(event.id, form.data.id));

		return message(form, 'success');
	}
} satisfies Actions;
