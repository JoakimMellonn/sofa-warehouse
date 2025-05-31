import { relations, sql } from 'drizzle-orm';
import { pgTable, integer, text, uuid, numeric, date, timestamp } from 'drizzle-orm/pg-core';

// Events
export const event = pgTable('event', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	status: text('status', { enum: ['scheduled', 'planning', 'done'] })
		.notNull()
		.default('scheduled'),
	datetime: timestamp('datetime', { withTimezone: true }).notNull().defaultNow(),
	location: text('location').notNull().default('None'),
	numberOfParticipants: integer('number_of_participants').notNull().default(0),
	price: numeric({ precision: 2 }).notNull().default('0')
});

export const eventRelations = relations(event, ({ many }) => ({
	eventsToDrinks: many(eventsToDrinks)
}));

export const eventsToDrinks = pgTable('events_to_drinks', {
	eventId: uuid('event_id')
		.notNull()
		.references(() => event.id),
	drinkId: uuid('drink_id')
		.notNull()
		.references(() => drink.id),
	amountSold: integer('amount_sold').notNull().default(0)
});

export type SelectEvent = typeof event.$inferSelect;
export type InsertEvent = typeof event.$inferInsert;

// Drinks and ingredients
export const drink = pgTable('drink', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull()
});

export const drinkRelations = relations(drink, ({ many }) => ({
	drinksToEvents: many(eventsToDrinks),
	drinkToIngredients: many(ingredient)
}));

export const drinksToIngredients = pgTable('drinks_to_ingredients', {
	drinkId: uuid('drink_id')
		.notNull()
		.references(() => drink.id),
	ingredientId: uuid('ingredient_id')
		.notNull()
		.references(() => ingredient.id),
	amountML: integer('amount_ml').notNull().default(0)
});

export type SelectDrink = typeof drink.$inferSelect;
export type InsertDrink = typeof drink.$inferInsert;

export const ingredient = pgTable('ingredient', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	amount: integer('amount').notNull().default(0),
	sizeML: integer('size_ml').notNull().default(0)
});

export const ingredientRelations = relations(ingredient, ({ many }) => ({
	drinkToIngredients: many(drink)
}));

export type SelectIngredient = typeof ingredient.$inferSelect;
export type InsertIngredient = typeof ingredient.$inferInsert;
