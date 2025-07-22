<script lang="ts">
	import '../app.css';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<header
	class="flex items-center justify-between border-b border-solid px-10 py-3 whitespace-nowrap"
>
	<div class="flex items-center gap-4">
		<div class="w-16">
			<a href="/" aria-label="Go to homepage">
				<enhanced:img src="$lib/assets/sofa-logo.png" alt="SOFA Logo" />
			</a>
		</div>
		<h2 class=" text-lg leading-tight font-bold tracking-[-0.015em]">Event Warehouse</h2>
	</div>
	<div class="flex flex-1 justify-end gap-8">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Dashboard</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/events">Events</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/inventory">Inventory</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
		<Button onclick={toggleMode} variant="outline" size="icon">
			<SunIcon
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			/>
			<MoonIcon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
<div class="group/design-root relative flex size-full flex-col overflow-x-hidden">
	<div class="layout-container flex h-full grow flex-col">
		<div class="flex flex-1 justify-center px-40 py-5">
			<div class="layout-content-container flex max-w-[960px] flex-1 flex-col">
				{@render children()}
			</div>
		</div>
	</div>
</div>
