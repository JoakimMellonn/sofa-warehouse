<script lang="ts">
	import { Pencil, Check } from '@lucide/svelte';
	import { Button } from '../button';
	import { Input } from '../input';

	let {
		value = $bindable(),
		type: inputType = 'text',
		onChange
	}: { value: any; type: 'text' | 'number'; onChange: (value: any) => void } = $props();

	let editing: boolean = $state(false);
</script>

{#if !editing}
	<div class="flex items-center {inputType == 'number' ? 'justify-end' : ''} gap-4">
		<p>{value}</p>
		<Button variant="outline" size="icon" class="size-9" onclick={() => (editing = true)}>
			<Pencil />
		</Button>
	</div>
{:else}
	<div class="flex {inputType == 'number' ? 'justify-end' : ''} gap-4">
		<Input
			bind:value
			type={inputType}
			autofocus
			onkeypress={(e) => {
				if (e.key == 'Enter') {
					onChange(value);
					editing = false;
				}
			}}
		/>
		<Button
			variant="outline"
			size="icon"
			class="size-9"
			onclick={() => {
				onChange(value);
				editing = false;
			}}
		>
			<Check />
		</Button>
	</div>
{/if}
