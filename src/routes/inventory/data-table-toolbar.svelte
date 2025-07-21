<script lang="ts" generics="TData">
	import XIcon from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import DataTableViewOptions from './data-table-view-options.svelte';

	let {
		table,
		addItem,
		updateTable
	}: { table: Table<TData>; addItem: () => void; updateTable: () => Promise<void> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class="flex items-center justify-between gap-2">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			placeholder="Filter ingredients..."
			value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
			oninput={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			onchange={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			class="h-8 w-[150px] lg:w-[250px]"
		/>

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Reset
				<XIcon />
			</Button>
		{/if}
	</div>
	{#if table.getSelectedRowModel().rows.length > 0}
		<DataTableViewOptions {table} {updateTable} />
	{/if}
	<Button variant="default" class="h-8" onclick={addItem}>Add item</Button>
</div>
