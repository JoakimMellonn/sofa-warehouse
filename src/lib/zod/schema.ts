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
	ingredients: z.array(ingredientSchema).min(1, 'Are you sure there is no ingredients?')
});
