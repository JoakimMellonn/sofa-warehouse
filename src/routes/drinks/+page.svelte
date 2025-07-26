<script lang="ts">
	import type { Drink } from './drinks';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import DataTable from './data-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { drinkSchema, type IngredientSchema } from '$lib/zod/schema';
	import { Separator } from '$lib/components/ui/separator';
	import type { SelectIngredient } from '$lib/server/db/schema';
	import { CheckIcon, ChevronsUpDownIcon, Trash2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';

	const ingredientTemplate: IngredientSchema = {
		id: '',
		amountML: 0
	};

	let { data } = $props();
	let allIngredients: SelectIngredient[] = $state(data.ingredients);
	let drinks: Drink[] = $state(data.drinks);
	let loading: boolean = $state(false);

	const { form, enhance, constraints, errors } = superForm(data.form, {
		dataType: 'json',
		validators: zod4Client(drinkSchema),
		onSubmit: ({ jsonData }) => {
			loading = true;
			const data = {
				...$form,
				ingredients: ingredients.map(({ ingredient }) => ingredient)
			};
			console.log(data);
			try {
				jsonData(data);
			} catch (error) {
				console.log(error);
			}
		},
		onError: ({ result }) => {
			console.log('error');
			console.log(result.error);
		},
		onResult: async ({ result }) => {
			console.log('result');
			console.log(result);
			if (result.type === 'success') {
				await updateTable();
				dialogOpen = false;
				selectedItem = undefined;
			}

			if (result.type === 'failure') {
				getErrors();
			}

			loading = false;
		}
	});
	let dialogOpen: boolean = $state(false);
	let selectedItem: Drink | undefined = $state(undefined);
	let ingredients: {
		ingredient: IngredientSchema;
		open: boolean;
		triggerRef: HTMLButtonElement;
		error: string;
	}[] = $state([{ ingredient: ingredientTemplate, open: false, triggerRef: null!, error: '' }]);
	let ingredientsError = $state('');

	function addIngredient() {
		ingredients.push({
			ingredient: ingredientTemplate,
			open: false,
			triggerRef: null!,
			error: ''
		});
	}

	function removeIngredient(index: number) {
		ingredients.splice(index, 1);
	}

	function getIngredientName(id: string): string {
		const ingredient = allIngredients.find((ingr) => ingr.id === id);
		return ingredient?.name ?? '';
	}

	function getErrors() {
		if (ingredients.length == 0) {
			ingredientsError = 'You actually have to add something.';
		}
		for (let ingredient of ingredients) {
			console.log(ingredient.ingredient.id);
			if (!ingredient.ingredient.id) {
				ingredient.error = 'You actually have to choose something.';
				continue;
			}
			if (ingredient.ingredient.amountML == 0) {
				ingredient.error = 'Are you sure this is the actual amount?';
			}
		}
	}

	function addDrink() {
		ingredients = [{ ingredient: ingredientTemplate, open: false, triggerRef: null!, error: '' }];
		$form.id = '';
		$form.name = '';
		dialogOpen = true;
	}

	async function updateDrink(selectedDrink: Drink) {
		selectedItem = selectedDrink;

		$form.id = selectedDrink.drink.id;
		$form.name = selectedDrink.drink.name;

		ingredients = [];
		for (let ingredient of selectedDrink.ingredients) {
			ingredients.push({
				ingredient: { id: ingredient.ingredient.id, amountML: ingredient.amountMl },
				open: false,
				triggerRef: null!,
				error: ''
			});
		}
		dialogOpen = true;
	}

	async function updateTable() {
		try {
			const data = await (await fetch('/api/drinks')).json();
			allIngredients = data.ingredients;
			drinks = data.drinks;
		} catch (error) {
			console.log(error);
		}
	}
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Drinks</h1>
<p class="text-muted-foreground mt-3 mb-10 text-sm">See all the drinks and their ingredients</p>

<DataTable data={drinks} addItem={addDrink} updateItem={updateDrink} {updateTable} />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[600px]">
		<form method="POST" action="?/{selectedItem ? 'updateDrink' : 'addDrink'}" use:enhance>
			{#if selectedItem}
				<Dialog.Header>
					<Dialog.Title>Update drink</Dialog.Title>
					<Dialog.Description>Update an existing drink in the system.</Dialog.Description>
				</Dialog.Header>
			{:else}
				<Dialog.Header>
					<Dialog.Title>Add drink</Dialog.Title>
					<Dialog.Description>Add a new drink to the system.</Dialog.Description>
				</Dialog.Header>
			{/if}
			<div class="grid gap-4 py-4">
				<input type="hidden" name="id" bind:value={$form.id} />
				<div class="grid grid-cols-5 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="Name"
						class="col-span-3"
						autocomplete="off"
						{...constraints}
						bind:value={$form.name}
					/>
				</div>
				<div class="-m-2 text-center">
					{#if $errors.name}
						<span class="text-danger col-span-3 col-start-2">{$errors.name}</span>
					{/if}
				</div>
				<Separator />
				{#each ingredients as ingredient}
					<div class="grid grid-cols-7 items-center gap-4">
						<div class="col-span-4">
							<Label for="id" class="mb-2 text-right">Ingredient</Label>
							<Popover.Root bind:open={ingredient.open}>
								<Popover.Trigger bind:ref={ingredient.triggerRef}>
									{#snippet child({ props })}
										<Button
											variant="outline"
											class="w-[200px] justify-between"
											{...props}
											role="combobox"
											aria-expanded={ingredient.open}
										>
											{getIngredientName(ingredient.ingredient.id) || 'Select an ingredient...'}
											<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-[200px] p-0">
									<Command.Root>
										<Command.Input placeholder="Search framework..." />
										<Command.List>
											<Command.Empty>No framework found.</Command.Empty>
											<Command.Group>
												{#each allIngredients as ingr}
													<Command.Item
														value={ingr.name}
														onSelect={() => {
															ingredient.ingredient.id = ingr.id;
															ingredient.open = false;
															tick().then(() => {
																ingredient.triggerRef.focus();
															});
														}}
													>
														<CheckIcon
															class={cn(
																'mr-2 size-4',
																ingredient.ingredient.id !== ingr.id && 'text-transparent'
															)}
														/>
														{ingr.name}
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.List>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
						<div class="col-span-2 col-start-5">
							<Label for="amountMl" class="mb-2 text-right">Amount (ml)</Label>
							<Input
								id="amountMl"
								name="amountMl"
								type="number"
								placeholder="Amount (ml)"
								autocomplete="off"
								bind:value={ingredient.ingredient.amountML}
							/>
						</div>
						<div class="col-span-1 col-start-7">
							<Button
								variant="secondary"
								size="icon"
								class="size-9 translate-y-2.5"
								onclick={() => {
									removeIngredient(ingredients.indexOf(ingredient));
								}}
							>
								<Trash2 />
							</Button>
						</div>
					</div>
					<div class="-m-2 text-center">
						{#if ingredient.error}
							<span class="text-danger col-span-3 col-start-2">{ingredient.error}</span>
						{/if}
					</div>
				{/each}
				<div class="grid grid-cols-4 items-center gap-4">
					<Button class="col-span-2 col-start-2" variant="outline" onclick={addIngredient}
						>Add another ingredient</Button
					>
				</div>
				<div class="-m-2 text-center">
					{#if ingredientsError}
						<span class="text-danger col-span-3 col-start-2">{ingredientsError}</span>
					{/if}
				</div>
			</div>
			<Dialog.Footer>
				{#if selectedItem}
					<Button type="submit" {loading}>Update drink</Button>
				{:else}
					<Button type="submit" {loading}>Add drink</Button>
				{/if}
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
