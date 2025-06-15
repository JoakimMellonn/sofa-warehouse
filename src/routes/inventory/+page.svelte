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

<DataTable data={ingredients} />
