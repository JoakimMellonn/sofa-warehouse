<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { NLPDateInput } from '$lib/components/ui/nlp-date-input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { dateProxy, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { partialEvent } from '$lib/zod/schema';

	const { data } = $props();
	const { form, errors, constraints, enhance, validateForm } = superForm(data.form, {
		onSubmit: () => (loading = true),
		onResult: ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				dialogOpen = false;
			}
		}
	});
	const proxyDate = dateProxy(form, 'datetime', { format: 'datetime-local' });
	let dialogOpen: boolean = $state(false);
	let currentPage: number = $state(0);
	let loading: boolean = $state(false);
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Events</h1>
<p class="text-muted-foreground mt-3 text-sm">See coming and past events</p>

<div class="flex justify-center">
	<Button class="sm:w-full lg:w-64" onclick={() => (dialogOpen = true)}>Add Event</Button>
</div>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Coming events</h3>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Past events</h3>

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
						bind:value={$proxyDate}
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
					<Button type="submit" {loading}>Add event</Button>
				</Dialog.Footer>
			{/if}
		</form>
	</Dialog.Content>
</Dialog.Root>
