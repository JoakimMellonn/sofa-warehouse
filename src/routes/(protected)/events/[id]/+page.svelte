<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	const { data } = $props();
	const event = data.event;
	let drinks = $state(data.drinks);

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

	function formatDateTime(date: Date): string {
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} · ${date.toLocaleTimeString('da-DK', { hour: 'numeric', minute: 'numeric' })}`;
	}
</script>

<p class="text-muted-foreground text-md mt-3 mb-6">
	<a href="/events">Events</a> / <span class="text-foreground">{event.name}</span>
</p>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{event.name}</h1>
<p class="text-muted-foreground mt-3 text-sm">{formatDateTime(event.datetime)}</p>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Event details</h3>
<div class="mt-4 rounded-lg border">
	<Table.Root>
		<Table.Body>
			<Table.Row class="h-16">
				<Table.Cell class="text-muted-foreground w-1/4">Date</Table.Cell>
				<Table.Cell class="text-foreground"
					>{`${months[event.datetime.getMonth()]} ${event.datetime.getDate()}, ${event.datetime.getFullYear()}`}</Table.Cell
				>
			</Table.Row>
			<Table.Row class="h-16">
				<Table.Cell class="text-muted-foreground">Location</Table.Cell>
				<Table.Cell class="text-foreground">{event.location}</Table.Cell>
			</Table.Row>
			<Table.Row class="h-16">
				<Table.Cell class="text-muted-foreground">Attendees</Table.Cell>
				<Table.Cell class="text-foreground">{event.numberOfParticipants}</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</div>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Drinks</h3>
<div class="mt-4 rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Ingredients</Table.Head>
				<Table.Head class="max-w-10">Amount Sold</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each drinks as drink}
				<Table.Row class="h-20">
					<Table.Cell>{drink.drink.drink.name}</Table.Cell>
					<Table.Cell>
						{#if drink.drink.ingredients.length > 0}
							{#each drink.drink.ingredients as ingredient}
								<Dialog.Root>
									<Dialog.Trigger class="{buttonVariants({ variant: 'default' })} mr-2 h-8">
										{ingredient.ingredient.name} ({ingredient.amountMl} ml)
									</Dialog.Trigger>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>{ingredient.ingredient.name}</Dialog.Title>
										</Dialog.Header>
										<div class="grid gap-4 py-4">
											<div class="grid grid-cols-4 items-center gap-4">
												<Label for="name" class="text-right">Name</Label>
												<Input
													name="name"
													class="col-span-3"
													value={ingredient.ingredient.name}
													disabled={true}
												/>
											</div>
											<div class="grid grid-cols-4 items-center gap-4">
												<Label for="amount" class="text-right">Amount</Label>
												<Input
													name="amount"
													class="col-span-3"
													value={ingredient.ingredient.amount}
													disabled={true}
												/>
											</div>
											<div class="grid grid-cols-4 items-center gap-4">
												<Label for="unit" class="text-right">Unit</Label>
												<Input
													name="unit"
													class="col-span-3"
													value={ingredient.ingredient.unit}
													disabled={true}
												/>
											</div>
											<div class="grid grid-cols-4 items-center gap-4">
												<Label for="sizeML" class="text-right">Size (ml)</Label>
												<Input
													name="sizeML"
													class="col-span-3"
													value={ingredient.ingredient.sizeML}
													disabled={true}
												/>
											</div>
										</div>
									</Dialog.Content>
								</Dialog.Root>
							{/each}
						{:else}
							<p>No ingredients.</p>
						{/if}
					</Table.Cell>
					<Table.Cell>{drink.amountSold}</Table.Cell>
				</Table.Row>
			{/each}
			{#if drinks.length == 0}
				<Table.Row>
					<Table.Cell colspan={5} class="h-20 text-center">No results.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>
