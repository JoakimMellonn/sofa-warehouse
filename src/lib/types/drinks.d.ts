import type { SelectDrink, SelectIngredient } from '$lib/server/db/schema';

export type Ingredient = {
	ingredient: SelectIngredient;
	amountMl: number;
};

export type Drink = {
	drink: SelectDrink;
	ingredients: Ingredient[];
};

export type DrinkRelation = {
	drink: Drink;
	amountSold: number;
};
