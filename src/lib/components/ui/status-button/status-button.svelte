<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '../button';
	import type { Status, StatusButtonProps } from './types';

	let { class: className, status }: StatusButtonProps = $props();

	function uppercaseFirstLetter(val: string): string {
		return val.charAt(0).toUpperCase() + val.slice(1);
	}

	function getColor(status: Status): string {
		switch (status) {
			case 'scheduled':
				return 'bg-primary';
			case 'planning':
				return 'bg-warning';
			case 'done':
				return 'bg-success';
			default:
				return '';
		}
	}
</script>

<Button class={cn(className, getColor(status))}>{uppercaseFirstLetter(status)}</Button>
