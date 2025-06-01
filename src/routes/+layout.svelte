<script lang="ts">
	import '../app.css';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';

	let { children } = $props();
</script>

<header
	class="flex items-center justify-between border-b border-solid border-b-[#f0f2f5] px-10 py-3 whitespace-nowrap"
>
	<div class="flex items-center gap-4 text-[#111418]">
		<div class="w-16">
			<enhanced:img img src="$lib/assets/sofa-logo.png" alt="SOFA Logo" />
		</div>
		<h2 class="text-lg leading-tight font-bold tracking-[-0.015em] text-[#111418]">
			Event Warehouse
		</h2>
	</div>
	<div class="flex flex-1 justify-end gap-8">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Dashboard</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Events</NavigationMenu.Link>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/">Inventory</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</header>
{@render children()}
