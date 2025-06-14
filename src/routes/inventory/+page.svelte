<script lang="ts">
	import type { SelectIngredient } from '$lib/server/db/schema';
	import DataTable from './data-table.svelte';

	let ingredients: SelectIngredient[] = $state([
		{
			id: 'ceres',
			name: 'Ceres Top',
			amount: 69,
			unit: 'Bottle(s)',
			sizeML: 330
		},
		{
			id: 'royal',
			name: 'Royal Classic',
			amount: 420,
			unit: 'Bottle(s)',
			sizeML: 330
		}
	]);
</script>

<div class="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden">
	<div class="layout-container flex h-full grow flex-col">
		<div class="flex flex-1 justify-center px-40 py-5">
			<div class="layout-content-container flex max-w-[960px] flex-1 flex-col">
				<DataTable data={ingredients} />
			</div>
		</div>
	</div>
</div>
