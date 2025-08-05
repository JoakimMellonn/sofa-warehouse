<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import type { SelectDrink } from '$lib/server/db/schema.js';
	import { CheckIcon, ChevronsUpDownIcon, Trash2 } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';
	import type { DrinkRelation } from '$lib/types/drinks.js';
	import EditBox from '$lib/components/ui/edit-box/edit-box.svelte';

	const { data } = $props();
	const event = data.event;
	const allDrinks = data.allDrinks;
	let drinks = $state(data.drinks);

	let dialogOpen: boolean = $state(false);
	let loading: boolean = $state(false);
	const drinkTemplate: SelectDrink = { id: '', name: '' };
	let addedDrinks: {
		drink: SelectDrink;
		open: boolean;
		triggerRef: HTMLButtonElement;
		error: string;
	}[] = $state([{ drink: drinkTemplate, open: false, triggerRef: null!, error: '' }]);
	let selectableDrinks = $derived.by(() => {
		const drinkIds = drinks.map((drink) => drink.drink.drink.id);
		const addedIds = addedDrinks.map((drink) => drink.drink.id);
		return allDrinks.filter(
			(drink) => !drinkIds.includes(drink.id) && !addedIds.includes(drink.id)
		);
	});

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

	async function updateTable() {
		const result = await fetch(`/api/events/${event.id}/drinks`);
		drinks = (await result.json()).drinks;
	}

	async function addDrinks() {
		loading = true;

		if (checkErrors()) {
			loading = false;
			return;
		}

		const drinks = addedDrinks.map((drink) => drink.drink);

		const body = { drinks, event };
		const result = await fetch(`/api/events/${event.id}/drinks`, {
			method: 'POST',
			body: JSON.stringify(body)
		});

		if (result.status != 200) {
			toast.error('Something went wrong! Check logs');
			console.log(await result.json());
		} else {
			await updateTable();
			toast.success('Added drinks!');
		}

		loading = false;
		dialogOpen = false;
		addedDrinks = [{ drink: drinkTemplate, open: false, triggerRef: null!, error: '' }];
	}

	async function removeDrink(drink: DrinkRelation) {
		loading = true;
		const body = { drinks: [drink.drink.drink] };
		const result = await fetch(`/api/events/${event.id}/drinks`, {
			method: 'DELETE',
			body: JSON.stringify(body)
		});

		if (result.status != 200) {
			loading = false;
			toast.error('Something went wrong! Check logs');
			return;
		}

		await updateTable();
		loading = false;
		toast.success('Drink removed!');
	}

	async function updateAmount(value: number, drink: DrinkRelation) {
		loading = true;
		const body = {
			drinkId: drink.drink.drink.id,
			amountSold: value
		};
		const result = await fetch(`/api/events/${event.id}/drinks`, {
			method: 'PUT',
			body: JSON.stringify(body)
		});

		if (result.status != 200) {
			loading = false;
			toast.error('Something went wrong! Check logs');
			return;
		}

		await updateTable();
		loading = false;
		toast.success('Drink updated!');
	}

	function checkErrors(): boolean {
		let error = false;
		for (let drink of addedDrinks) {
			if (!drink.drink.id) {
				drink.error = 'You actually have to choose something.';
				error = true;
				continue;
			}
			drink.error = '';
		}
		return error;
	}

	function addDrink() {
		if (checkErrors()) {
			return;
		}
		addedDrinks.push({ drink: drinkTemplate, open: false, triggerRef: null!, error: '' });
	}

	function removeAddedDrink(index: number) {
		addedDrinks.splice(index, 1);
	}

	function getDrinkName(id: string): string {
		const drink = allDrinks.find((drnk) => drnk.id === id);
		return drink?.name ?? '';
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
<div class="flex justify-center">
	<Button class="sm:w-full lg:w-64" onclick={() => (dialogOpen = true)}>Add Drink</Button>
</div>
<div class="mt-4 rounded-lg border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Ingredients</Table.Head>
				<Table.Head class="w-40">Amount Sold</Table.Head>
				<Table.Head class="max-w-4"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each drinks as relation}
				<Table.Row class="h-20">
					<Table.Cell>{relation.drink.drink.name}</Table.Cell>
					<Table.Cell>
						{#if relation.drink.ingredients.length > 0}
							{#each relation.drink.ingredients as ingredient}
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
					<Table.Cell
						><EditBox
							bind:value={relation.amountSold}
							type="number"
							onChange={(value) => updateAmount(value, relation)}
						/></Table.Cell
					>
					<Table.Cell class="text-center">
						<Button
							variant="secondary"
							size="icon"
							class="size-9"
							{loading}
							onclick={() => {
								removeDrink(relation);
							}}
						>
							<Trash2 />
						</Button>
					</Table.Cell>
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

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Drink</Dialog.Title>
		</Dialog.Header>
		<Separator />
		{#each addedDrinks as drink}
			<div class="grid grid-cols-7 items-center gap-4">
				<div class="col-span-6">
					<Label for="id" class="mb-2 text-right">Drink</Label>
					<Popover.Root bind:open={drink.open}>
						<Popover.Trigger bind:ref={drink.triggerRef}>
							{#snippet child({ props })}
								<Button
									variant="outline"
									class="w-[200px] justify-between"
									{...props}
									role="combobox"
									aria-expanded={drink.open}
								>
									{getDrinkName(drink.drink.id) || 'Select an ingredient...'}
									<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-[200px] p-0">
							<Command.Root>
								<Command.Input placeholder="Search drinks..." />
								<Command.List>
									<Command.Empty>No framework found.</Command.Empty>
									<Command.Group>
										{#each selectableDrinks as drnk}
											<Command.Item
												value={drnk.name}
												onSelect={() => {
													drink.drink = drnk;
													drink.open = false;
													tick().then(() => {
														drink.triggerRef.focus();
													});
													checkErrors();
												}}
											>
												<CheckIcon
													class={cn(
														'mr-2 size-4',
														drink.drink.id !== drnk.id && 'text-transparent'
													)}
												/>
												{drnk.name}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>
				<div class="col-span-1 col-start-7">
					<Button
						variant="secondary"
						size="icon"
						class="size-9 translate-y-2.5"
						onclick={() => {
							removeAddedDrink(addedDrinks.indexOf(drink));
						}}
					>
						<Trash2 />
					</Button>
				</div>
			</div>
			<div class="-m-2 text-center">
				{#if drink.error}
					<span class="text-danger col-span-3 col-start-2">{drink.error}</span>
				{/if}
			</div>
		{/each}
		{#if selectableDrinks.length}
			<div class="grid grid-cols-4 items-center gap-4">
				<Button class="col-span-2 col-start-2" variant="outline" onclick={addDrink}
					>Add another drink</Button
				>
			</div>
		{/if}
		<Dialog.Footer>
			<Button
				variant="outline"
				{loading}
				onclick={() => {
					addedDrinks = [{ drink: drinkTemplate, open: false, triggerRef: null!, error: '' }];
					dialogOpen = false;
				}}>Cancel</Button
			>
			<Button autofocus {loading} onclick={addDrinks}>Add Drink</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
