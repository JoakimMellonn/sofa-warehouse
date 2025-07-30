import { z } from 'zod/v4';

export const itemSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'You actually have to write something.'),
	amount: z.number().min(0, "No, it can't be less than zero..."),
	unit: z.string().min(1, 'You actually have to write something.'),
	sizeML: z.number().min(1, 'Are you sure this is the actual size?')
});

export const ingredientSchema = z.object({
	id: z.string(),
	amountML: z.number().min(1, 'Are you sure this is the actual size?')
});

export type IngredientSchema = z.infer<typeof ingredientSchema>;

export const drinkSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'You actually have to write something.'),
	ingredients: z.array(ingredientSchema)
});

export const eventSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(['scheduled', 'planning', 'done']).default('scheduled'),
	datetime: z.date(),
	location: z.string(),
	numberOfParticipants: z.number().default(0),
	price: z.number().min(0).default(0)
});

export const partialEvent = z.object({
	name: z.string().min(1, 'You actually have to write something.'),
	location: z.string().min(1, 'You actually have to write something.'),
	numberOfParticipants: z.number().min(0, "No, it can't be less than zero...").default(0),
	price: z.number().min(0, "No, it can't be less than zero...").default(0)
});

// Login pages
export const userCreateSchema = z.object({
	firstName: z.string().min(1, { message: "You can't not have a name?" }),
	lastName: z.string().min(1, { message: 'You must have a last name' }),
	email: z.email(),
	password: z.string().min(10),
	confirmPassword: z.string().min(10)
});

export const userLoginSchema = z.object({
	email: z.email(),
	password: z.string().min(10)
});

export const userResetSchema = z.object({
	email: z.email(),
	confirmPassword: z.string().min(10),
	token: z.string().nullable()
});

export const passwordResetSchema = z.object({
	password: z.string().min(10),
	confirmPassword: z.string().min(10),
	token: z.string().nullable()
});

export const verifyEmailSchema = z.object({
	code: z.string().min(6).max(6),
	userId: z.string()
});
