<!--
	Installed from @ieedan/shadcn-svelte-extras
-->

<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { LightSwitchProps } from './types';
	import { cn } from '$lib/utils/utils';

	let { class: className, variant = 'outline' }: LightSwitchProps = $props();
</script>

<Button onclick={toggleMode} class={cn(className)} {variant} size="icon">
	<SunIcon class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
	<MoonIcon class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
	<span class="sr-only">Toggle theme</span>
</Button>
