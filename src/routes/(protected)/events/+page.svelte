<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { NLPDateInput } from '$lib/components/ui/nlp-date-input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { dateProxy, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { partialEvent } from '$lib/zod/schema';
	import { toast } from 'svelte-sonner';
	import type { SelectEvent } from '$lib/server/db/schema.js';
	import StatusButton from '$lib/components/ui/status-button/status-button.svelte';

	const { data } = $props();
	const { form, errors, constraints, enhance, validateForm } = superForm(data.form, {
		dataType: 'json',
		onSubmit: () => {
			loading = true;
			console.log($form);
		},
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success('Added event!');
				await updateTable();
				dialogOpen = false;
			}
			loading = false;
		}
	});
	const proxyDate = dateProxy(form, 'datetime', { format: 'datetime-local' });

	let events: SelectEvent[] = $state(data.events);
	let upcomingEvents: SelectEvent[] = $derived(
		events.filter((event) => event.datetime > new Date())
	);
	let pastEvents: SelectEvent[] = $derived(events.filter((event) => event.datetime < new Date()));

	let dialogOpen: boolean = $state(false);
	let currentPage: number = $state(0);
	let loading: boolean = $state(false);

	async function updateTable() {
		try {
			const data = await fetch('/api/events');
			const payload = await data.json();
			events = payload.events.map((ev: any) => ({
				...ev,
				datetime: new Date(ev.datetime)
			}));
		} catch (error) {
			console.log(error);
		}
	}

	function formatDate(date: Date): string {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}

	function formatTime(date: Date): string {
		return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
	}
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Events</h1>
<p class="text-muted-foreground mt-3 text-sm">See coming and past events</p>

<div class="flex justify-center">
	<Button class="sm:w-full lg:w-64" onclick={() => (dialogOpen = true)}>Add Event</Button>
</div>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Coming events</h3>
<div class="mt-4 rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="min-w-[200px]">Name</Table.Head>
				<Table.Head>Date</Table.Head>
				<Table.Head>Starting Time</Table.Head>
				<Table.Head>Location</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each upcomingEvents as event}
				<Table.Row class="h-20">
					<Table.Cell><a href={`/events/${event.id}`}>{event.name}</a></Table.Cell>
					<Table.Cell>{formatDate(event.datetime)}</Table.Cell>
					<Table.Cell>{formatTime(event.datetime)}</Table.Cell>
					<Table.Cell>{event.location}</Table.Cell>
					<Table.Cell><StatusButton status={event.status} class="h-8" /></Table.Cell>
				</Table.Row>
			{/each}
			{#if upcomingEvents.length == 0}
				<Table.Row>
					<Table.Cell colspan={5} class="h-20 text-center">No results.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Past events</h3>
<div class="mt-4 rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="min-w-[200px]">Name</Table.Head>
				<Table.Head>Date</Table.Head>
				<Table.Head>Starting Time</Table.Head>
				<Table.Head>Location</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each pastEvents as event}
				<Table.Row class="h-20">
					<Table.Cell><a href={`/events/${event.id}`}>{event.name}</a></Table.Cell>
					<Table.Cell>{formatDate(event.datetime)}</Table.Cell>
					<Table.Cell>{formatTime(event.datetime)}</Table.Cell>
					<Table.Cell>{event.location}</Table.Cell>
					<Table.Cell><StatusButton status={event.status} class="h-8" /></Table.Cell>
				</Table.Row>
			{/each}
			{#if pastEvents.length == 0}
				<Table.Row>
					<Table.Cell colspan={5} class="h-20 text-center">No results.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<form method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Add new event</Dialog.Title>
				<Dialog.Description>Add a new event to the calendar.</Dialog.Description>
			</Dialog.Header>
			{#if currentPage == 0}
				<div class="grid gap-4 py-4">
					<input type="hidden" name="id" bind:value={$form.id} />
					<input type="hidden" name="status" bind:value={$form.status} />
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Name"
							class="col-span-3"
							autocomplete="off"
							{...constraints}
							bind:value={$form.name}
						/>
						{#if $errors.name}<span class="text-danger col-span-3 col-start-2">{$errors.name}</span
							>{/if}
						<Label for="location" class="text-right">Location</Label>
						<Input
							id="location"
							name="location"
							type="text"
							placeholder="Stibitz 2"
							class="col-span-3"
							autocomplete="off"
							{...constraints}
							bind:value={$form.location}
						/>
						{#if $errors.location}<span class="text-danger col-span-3 col-start-2"
								>{$errors.location}</span
							>{/if}
						<Label for="numberOfParticipants">Number of participants</Label>
						<Input
							id="numberOfParticipants"
							name="numberOfParticipants"
							type="number"
							placeholder="69"
							class="col-span-3"
							autocomplete="off"
							{...constraints}
							bind:value={$form.numberOfParticipants}
						/>
						{#if $errors.numberOfParticipants}<span class="text-danger col-span-3 col-start-2"
								>{$errors.numberOfParticipants}</span
							>{/if}
						<Label for="price" class="text-right">Price (DKK)</Label>
						<Input
							id="price"
							name="price"
							type="number"
							placeholder="69"
							class="col-span-3"
							autocomplete="off"
							{...constraints}
							bind:value={$form.price}
						/>
						{#if $errors.price}<span class="text-danger col-span-3 col-start-2"
								>{$errors.price}</span
							>{/if}
					</div>
				</div>
				<Dialog.Footer>
					<Button
						onclick={async () => {
							const result = await validateForm({ update: true, schema: zod4(partialEvent) });
							if (result.valid) {
								console.log('valid');
								currentPage = 1;
								return;
							}
							$errors = result.errors;
						}}>Next</Button
					>
				</Dialog.Footer>
			{:else if currentPage == 1}
				<Separator class="my-4" />
				<Dialog.Title>Please select a date and time</Dialog.Title>
				<div class="my-6">
					<NLPDateInput
						min={new Date()}
						onChoice={({ date }) => {
							$form.datetime = date;
							currentPage = 2;
						}}
					/>
				</div>
				<Dialog.Footer>
					<Button variant="outline" onclick={() => (currentPage = 0)}>Back</Button>
				</Dialog.Footer>
			{:else if currentPage == 2}
				<div class="my-4 grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						class="col-span-3"
						disabled={true}
						bind:value={$form.name}
					/>
					<Label for="datetime" class="text-right">Date and time</Label>
					<Input
						id="datetime"
						name="datetime"
						type="datetime-local"
						class="col-span-3"
						disabled={true}
						value={$proxyDate}
					/>
					<Label for="location" class="text-right">Location</Label>
					<Input
						id="location"
						name="location"
						type="text"
						class="col-span-3"
						disabled={true}
						bind:value={$form.location}
					/>
					<Label for="numberOfParticipants">Number of participants</Label>
					<Input
						id="numberOfParticipants"
						name="numberOfParticipants"
						type="number"
						class="col-span-3"
						disabled={true}
						{...constraints}
						bind:value={$form.numberOfParticipants}
					/>
					<Label for="price" class="text-right">Price (DKK)</Label>
					<Input
						id="price"
						name="price"
						type="number"
						class="col-span-3"
						disabled={true}
						bind:value={$form.price}
					/>
				</div>
				<Dialog.Footer>
					<Button variant="outline" {loading} onclick={() => (currentPage = 1)}>Back</Button>
					<Button autofocus type="submit" {loading}>Add event</Button>
				</Dialog.Footer>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
