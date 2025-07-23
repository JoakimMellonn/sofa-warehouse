<script lang="ts">
	import type { Drink, Ingredient } from './drinks';
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
	import { CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';

	const ingredientTemplate: IngredientSchema = {
		id: '',
		amountML: 0
	};

	let { data } = $props();
	const allIngredients: SelectIngredient[] = data.ingredients;
	const { form, enhance, constraints, errors } = superForm(data.form, {
		validators: zod4Client(drinkSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dialogOpen = false;
				selectedItem = undefined;
				console.log(result.data!.form.message);
				drinks = result.data!.form.message;
			}
		}
	});
	let dialogOpen: boolean = $state(false);
	let selectedItem: Drink | undefined = $state(undefined);
	let ingredients: {
		ingredient: IngredientSchema;
		open: boolean;
		triggerRef: HTMLButtonElement;
	}[] = $state([{ ingredient: ingredientTemplate, open: false, triggerRef: null! }]);

	const ingredientOne: Ingredient = {
		ingredient: {
			id: '1',
			name: 'Some ingredient',
			amount: 20,
			unit: 'Bottle(s)',
			sizeML: 100
		},
		amountMl: 100
	};
	const ingredientTwo: Ingredient = {
		ingredient: {
			id: '2',
			name: 'Another ingredient',
			amount: 30,
			unit: 'Bottle(s)',
			sizeML: 200
		},
		amountMl: 200
	};
	const someDrink: Drink = {
		drink: {
			name: 'Some drink',
			id: '1'
		},
		ingredients: [ingredientOne, ingredientTwo]
	};

	let drinks: Drink[] = $state([someDrink]);

	function addIngredient() {
		ingredients.push({ ingredient: ingredientTemplate, open: false, triggerRef: null! });
	}

	function getIngredientName(id: string): string {
		const ingredient = allIngredients.find((ingr) => ingr.id === id);
		return ingredient?.name ?? '';
	}

	async function addItem() {
		ingredients = [{ ingredient: ingredientTemplate, open: false, triggerRef: null! }];
		dialogOpen = true;
	}
	async function updateItem() {}
	async function updateTable() {}
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Drinks</h1>
<p class="text-muted-foreground mt-3 mb-10 text-sm">See all the drinks and their ingredients</p>

<DataTable data={drinks} {addItem} {updateItem} {updateTable} />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form method="POST" action="?/{selectedItem ? 'updateItem' : 'addItem'}" use:enhance>
			{#if selectedItem}
				<Dialog.Header>
					<Dialog.Title>Update item</Dialog.Title>
					<Dialog.Description>Update an existing item in the inventory.</Dialog.Description>
				</Dialog.Header>
			{:else}
				<Dialog.Header>
					<Dialog.Title>Add item</Dialog.Title>
					<Dialog.Description>Add a new item to the inventory.</Dialog.Description>
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
					{#if $errors.name}<span class="text-danger col-span-3 col-start-2">{$errors.name}</span
						>{/if}
				</div>
				<Separator />
				{#each ingredients as ingredient}
					<div class="grid grid-cols-6 items-center gap-4">
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
					</div>
				{/each}
				<div class="grid grid-cols-4 items-center gap-4">
					<Button class="col-span-2 col-start-2" variant="outline" onclick={addIngredient}
						>Add another ingredient</Button
					>
				</div>
			</div>
			<Dialog.Footer>
				{#if selectedItem}
					<Button type="submit">Update item</Button>
				{:else}
					<Button type="submit">Add item</Button>
				{/if}
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
