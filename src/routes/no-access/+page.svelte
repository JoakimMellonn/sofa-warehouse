<script>
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/authClient';
	import { Button } from '$lib/components/ui/button';

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

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	Your account does not have access to this page.
</h1>
<p class="text-muted-foreground mt-3 mb-10 text-sm">
	Please contact someone from SOFA to get access, or click the button below, to sign in with another
	account.
</p>

<Button onclick={signOut}>Sign out</Button>
