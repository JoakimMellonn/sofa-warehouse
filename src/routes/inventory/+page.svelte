<script lang="ts">
	import type { SelectIngredient } from '$lib/server/db/schema';
	import type { PageProps } from './$types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import DataTable from './data-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { addItemSchema } from '$lib/zod/schema';

	let { data }: PageProps = $props();
	const { form, enhance, constraints } = superForm(data.form, {
		validators: zod4Client(addItemSchema)
	});
	let ingredients: SelectIngredient[] = data.ingredients;
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
						type="text"
						placeholder="Name"
						class="col-span-3"
						autocomplete="off"
						{...constraints}
						bind:value={$form.name}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="amount" class="text-right">Amount</Label>
					<Input
						id="amount"
						type="number"
						placeholder="0"
						class="col-span-3"
						{...constraints}
						bind:value={$form.amount}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="unit" class="text-right">Unit</Label>
					<Input
						id="unit"
						type="text"
						placeholder="Bottle(s)"
						class="col-span-3"
						{...constraints}
						bind:value={$form.unit}
					/>
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="sizeML" class="text-right">Size (ml)</Label>
					<Input
						id="sizeML"
						type="number"
						placeholder="0"
						class="col-span-3"
						{...constraints}
						bind:value={$form.sizeML}
					/>
				</div>
			</div>
			<Dialog.Footer>
				<Button type="submit">Add item</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
