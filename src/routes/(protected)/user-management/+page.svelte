<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { authClient } from '$lib/authClient';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';

	const { data } = $props();
	let users = $state(data.users);
	let loading: boolean = $state(false);

	async function changeRole(user: any, role: 'user' | 'admin') {
		loading = true;
		await authClient.admin.setRole({
			userId: user.id,
			role: role
		});
		await updateTable();
		loading = false;
	}

	async function removeUser(user: any) {
		loading = true;
		await authClient.admin.removeUser({
			userId: user.id
		});
		await updateTable();
		loading = false;
	}

	async function updateTable() {
		const { data, error } = await authClient.admin.listUsers({
			query: {
				limit: 1000
			}
		});
		if (error) {
			console.log(error);
		}

		if (data) {
			users = data.users;
		}
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
			<Table.Head>Change role</Table.Head>
			<Table.Head>Remove User</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users as user}
			<Table.Row>
				<Table.Cell>{user.name}</Table.Cell>
				<Table.Cell>{user.email}</Table.Cell>
				<Table.Cell>{user.role}</Table.Cell>
				<Table.Cell>
					{#if user.role != 'admin'}
						<Button class="h-8" {loading} onclick={() => changeRole(user, 'admin')}
							>Make admin</Button
						>
					{:else}
						<Button class="h-8" variant="outline" {loading} onclick={() => changeRole(user, 'user')}
							>Make guest</Button
						>
					{/if}
				</Table.Cell>
				<Table.Cell>
					<Dialog.Root>
						<Dialog.Trigger class="{buttonVariants({ variant: 'destructive' })} h-8"
							>Remove user</Dialog.Trigger
						>
						<Dialog.Content>
							<Dialog.Header>
								<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete this account.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<Button
									class="h-8"
									variant="destructive"
									{loading}
									onclick={() => removeUser(user)}
								>
									Yes, delete the user
								</Button>
							</Dialog.Footer>
						</Dialog.Content>
					</Dialog.Root>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
