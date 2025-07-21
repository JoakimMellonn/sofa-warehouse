<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash2 } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { table, updateTable }: { table: Table<TData>; updateTable: () => Promise<void> } = $props();
	let dialogOpen: boolean = $state(false);

	async function removeSelectedItems() {
		console.log(`${JSON.stringify(table.getSelectedRowModel().rows)}`);
		try {
			const result = await fetch('/api/items', {
				method: 'DELETE',
				body: JSON.stringify({ rows: table.getSelectedRowModel().rows })
			});
			console.log(result);
		} catch (error) {
			console.log(error);
		}
		await updateTable();
		table.resetRowSelection();
		dialogOpen = false;
	}
</script>

<Button
	variant="outline"
	class="h-8"
	onclick={() => {
		dialogOpen = true;
	}}><Trash2 />Remove selected</Button
>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure sure?</Dialog.Title>
			<Dialog.Description
				>This will NOT delete the items, but it will set their amount value to 0.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
			<Button variant="destructive" onclick={removeSelectedItems}>Yes, delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
