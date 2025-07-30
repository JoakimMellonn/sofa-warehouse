<script>
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/authClient';
	import { goto } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
	const session = authClient.useSession();

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/login');
				}
			}
		});
	}
</script>

<ModeWatcher />
<Toaster />
<header
	class="flex items-center justify-between border-b border-solid px-10 py-3 whitespace-nowrap"
>
	<div class="flex items-center gap-4">
		<div class="w-16">
			<a
				href={$session.data?.user.role == 'admin' ? '/' : '/no-access'}
				aria-label="Go to homepage"
			>
				<enhanced:img src="$lib/assets/sofa-logo.png" alt="SOFA Logo" />
			</a>
		</div>
		<h2 class=" text-lg leading-tight font-bold tracking-[-0.015em]">warehouse™</h2>
	</div>
	<div class="flex flex-1 justify-end gap-4">
		{#if $session.data?.user.role == 'admin'}
			<NavigationMenu.Root>
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/">Dashboard</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/events">Events</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/drinks">Drinks</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/inventory">Inventory</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link href="/user-management">User Management</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>
		{/if}
		{#if $session.data}
			<Button onclick={signOut}>Sign out</Button>
		{/if}
		<LightSwitch />
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
