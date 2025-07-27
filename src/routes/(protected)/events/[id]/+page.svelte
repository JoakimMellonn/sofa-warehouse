<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

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
	let eventName: string = $state('Event name');
	let date: Date = $state(new Date());

	function formatDateTime(date: Date): string {
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} · ${date.toLocaleTimeString('da-DK', { hour: 'numeric', minute: 'numeric' })}`;
	}
</script>

<p class="text-muted-foreground text-md mt-3 mb-6">
	Events / <span class="text-foreground">{eventName}</span>
</p>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{eventName}</h1>
<p class="text-muted-foreground mt-3 text-sm">{formatDateTime(date)}</p>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Event details</h3>
<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-1/4"></Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row class="h-16">
			<Table.Cell class="text-muted-foreground">Date</Table.Cell>
			<Table.Cell class="text-foreground"
				>{`${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</Table.Cell
			>
		</Table.Row>
		<Table.Row class="h-16">
			<Table.Cell class="text-muted-foreground">Location</Table.Cell>
			<Table.Cell class="text-foreground">Stibiz</Table.Cell>
		</Table.Row>
		<Table.Row class="h-16">
			<Table.Cell class="text-muted-foreground">Attendees</Table.Cell>
			<Table.Cell class="text-foreground">69</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>

<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Drinks</h3>
<div class="mt-3 flex overflow-hidden rounded-lg border border-gray-300 bg-white">
	<table class="flex-1">
		<thead>
			<tr class="bg-white">
				<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium">
					Drink Name
				</th>
				<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium">Ingredients</th
				>
				<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium"> Price </th>
				<th class="w-60 px-4 py-3 text-left text-sm leading-normal font-medium">Cost</th>
			</tr>
		</thead>
		<tbody>
			<tr class="border-t border-t-[#dbe0e6]">
				<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">SOFA Drink</td>
				<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
					<ol>
						<li>CUBA Kurant - 4cl</li>
						<li>Lemon Soda</li>
						<li>Ice</li>
					</ol>
				</td>
				<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal"
					>2 Klip - 20 DKK</td
				>
				<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">10 DKK</td>
			</tr>
		</tbody>
	</table>
</div>
