<script lang="ts">
	import { authClient } from '$lib/authClient';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';

	const { data } = $props();
	const users = data.users;
	console.log(users);

	async function makeAdmin(user: any) {
		await authClient.admin.setRole({
			userId: user.id,
			role: 'admin'
		});
		// TODO: refresh table
	}
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">User Management</h1>
<p class="text-muted-foreground mt-3 mb-10 text-sm">
	See all the users and change who have access to the system.
</p>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Email</Table.Head>
			<Table.Head>Role</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users as user}
			<Table.Row>
				<Table.Cell>{user.name}</Table.Cell>
				<Table.Cell>{user.email}</Table.Cell>
				<Table.Cell
					>{user.role}
					{#if user.role != 'admin'}
						<Button class="ml-4 h-8" onclick={() => makeAdmin(user)}>Make admin</Button>
					{/if}
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
