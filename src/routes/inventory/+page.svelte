<script lang="ts">
	import type { SelectIngredient } from '$lib/server/db/schema';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import DataTable from './data-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { addItemSchema } from '$lib/zod/schema';

	let { data } = $props();
	let ingredients: SelectIngredient[] = $state(data.ingredients);
	const { form, enhance, constraints, errors } = superForm(data.form, {
		validators: zod4Client(addItemSchema),
		onResult: ({ result }) => {
			if (result.type === 'success') {
				addItemOpen = false;
				console.log(result.data!.form.message);
				ingredients = result.data!.form.message;
			}
		}
	});
	let addItemOpen: boolean = $state(false);

	function addItem() {
		addItemOpen = true;
	}
</script>

<DataTable data={ingredients} {addItem} />

<Dialog.Root bind:open={addItemOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<form method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Add item</Dialog.Title>
				<Dialog.Description>Add a new item to the inventory.</Dialog.Description>
			</Dialog.Header>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
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
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="amount" class="text-right">Amount</Label>
					<Input
						id="amount"
						name="amount"
						type="number"
						placeholder="0"
						class="col-span-3"
						{...constraints}
						bind:value={$form.amount}
					/>
					{#if $errors.amount}<span class="text-danger col-span-3 col-start-2"
							>{$errors.amount}</span
						>{/if}
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="unit" class="text-right">Unit</Label>
					<Input
						id="unit"
						name="unit"
						type="text"
						placeholder="Bottle(s)"
						class="col-span-3"
						{...constraints}
						bind:value={$form.unit}
					/>
					{#if $errors.unit}<span class="text-danger col-span-3 col-start-2">{$errors.unit}</span
						>{/if}
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="sizeML" class="text-right">Size (ml)</Label>
					<Input
						id="sizeML"
						name="sizeML"
						type="number"
						placeholder="0"
						class="col-span-3"
						{...constraints}
						bind:value={$form.sizeML}
					/>
					{#if $errors.sizeML}<span class="text-danger col-span-3 col-start-2"
							>{$errors.sizeML}</span
						>{/if}
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Add item</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
