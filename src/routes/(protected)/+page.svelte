<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import StatusButton from '$lib/components/ui/status-button/status-button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { SelectEvent } from '$lib/server/db/schema';
	import { Triangle } from '@lucide/svelte';

	const { data } = $props();

	let events: SelectEvent[] = $state(data.events);
	let upcomingEvents: SelectEvent[] = $derived(
		events.filter((event) => event.datetime > new Date())
	);

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

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">SOFA warehouse</h1>
<p class="text-muted-foreground mt-3 text-sm">Track events, sales and stock</p>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Events</h3>
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

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Sales & Stock summary</h3>
<div class="flex flex-wrap gap-4 py-4">
	<Card.Root class="min-w-32 flex-1">
		<Card.Header>
			<Card.Title>Sales</Card.Title>
			<Card.Description>Total sales for this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				<span class={data.salesThisYear > data.salesLastYear ? 'text-success' : 'text-danger'}>
					{#if data.salesThisYear > data.salesLastYear}
						<Triangle size="12" class="inline -translate-y-0.5" />
					{:else}
						<Triangle size="12" class="inline -translate-y-0.5 rotate-180" />
					{/if}
					{data.salesThisYear}
				</span>
				drinks sold (last year: {data.salesLastYear})
			</p>
		</Card.Content>
	</Card.Root>
	<Card.Root class="min-w-32 flex-1">
		<Card.Header>
			<Card.Title>Attendance</Card.Title>
			<Card.Description>Total attendance for this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				<span
					class={data.attendanceThisYear > data.attendanceLastYear ? 'text-success' : 'text-danger'}
				>
					{#if data.attendanceThisYear > data.attendanceLastYear}
						<Triangle size="12" class="inline -translate-y-0.5" />
					{:else}
						<Triangle size="12" class="inline -translate-y-0.5 rotate-180" />
					{/if}
					{data.attendanceThisYear}
				</span>
				attendees (last year: {data.attendanceLastYear})
			</p>
		</Card.Content>
	</Card.Root>
	<Card.Root class="min-w-32 flex-1">
		<Card.Header>
			<Card.Title>Low stock</Card.Title>
			<Card.Description>Total sales for this year</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>Card Content</p>
		</Card.Content>
	</Card.Root>
</div>
