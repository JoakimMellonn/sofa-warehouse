import { relations, sql } from 'drizzle-orm';
import {
	pgTable,
	integer,
	text,
	uuid,
	numeric,
	timestamp,
	primaryKey,
	boolean
} from 'drizzle-orm/pg-core';

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

export const eventsToDrinks = pgTable(
	'events_to_drinks',
	{
		eventId: uuid('event_id')
			.notNull()
			.references(() => event.id),
		drinkId: uuid('drink_id')
			.notNull()
			.references(() => drink.id),
		amountSold: integer('amount_sold').notNull().default(0)
	},
	(t) => [primaryKey({ columns: [t.eventId, t.drinkId] })]
);

export const eventsToDrinksRelations = relations(eventsToDrinks, ({ one }) => ({
	event: one(event, {
		references: [event.id],
		fields: [eventsToDrinks.eventId]
	}),
	drink: one(drink, {
		references: [drink.id],
		fields: [eventsToDrinks.drinkId]
	})
}));

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
	drinkToIngredients: many(drinksToIngredients)
}));

export const drinksToIngredients = pgTable(
	'drinks_to_ingredients',
	{
		drinkId: uuid('drink_id')
			.notNull()
			.references(() => drink.id),
		ingredientId: uuid('ingredient_id')
			.notNull()
			.references(() => ingredient.id),
		amountML: integer('amount_ml').notNull().default(0)
	},
	(t) => [primaryKey({ columns: [t.drinkId, t.ingredientId] })]
);

export const drinksToIngredientsRelations = relations(drinksToIngredients, ({ one }) => ({
	drink: one(drink, {
		references: [drink.id],
		fields: [drinksToIngredients.drinkId]
	}),
	ingredient: one(ingredient, {
		references: [ingredient.id],
		fields: [drinksToIngredients.ingredientId]
	})
}));

export type SelectDrink = typeof drink.$inferSelect;
export type InsertDrink = typeof drink.$inferInsert;
export type SelectDrinksToIngredients = typeof drinksToIngredients.$inferSelect;
export type InsertDrinksToIngredients = typeof drinksToIngredients.$inferInsert;

export const ingredient = pgTable('ingredient', {
	id: uuid('id')
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	amount: integer('amount').notNull().default(0),
	unit: text('unit').notNull().default('Bottle(s)'),
	sizeML: integer('size_ml').notNull().default(0)
});

export const ingredientRelations = relations(ingredient, ({ many }) => ({
	drinkToIngredients: many(drinksToIngredients)
}));

export type SelectIngredient = typeof ingredient.$inferSelect;
export type InsertIngredient = typeof ingredient.$inferInsert;

// BETTER AUTH generated stuff
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role').default('guest')
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});
