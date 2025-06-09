<script>
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div class="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden">
	<div class="layout-container flex h-full grow flex-col">
		<div class="flex flex-1 justify-center px-40 py-5">
			<div class="layout-content-container flex max-w-[960px] flex-1 flex-col">
				<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					SOFA warehouse
				</h1>
				<p class="text-muted-foreground mt-3 text-sm">Track events, sales and stock</p>

				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Events</h3>
				<div class="mt-3 flex overflow-hidden rounded-lg border border-gray-300 bg-white">
					<table class="flex-1">
						<thead>
							<tr class="bg-white">
								<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium">
									Event Name
								</th>
								<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium"
									>Date</th
								>
								<th class="w-[400px] px-4 py-3 text-left text-sm leading-normal font-medium">
									Location
								</th>
								<th class="w-60 px-4 py-3 text-left text-sm leading-normal font-medium">Status</th>
							</tr>
						</thead>
						<tbody>
							<tr class="border-t border-t-[#dbe0e6]">
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									Summer Bash
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									July 15, 2024
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									City Park
								</td>
								<td class="h-[72px] w-60 px-4 py-2 text-sm leading-normal font-normal">
									<button
										class="flex h-8 w-full max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f5] px-4 text-sm leading-normal font-medium"
									>
										<span class="truncate">Scheduled</span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
					Sales & Stock summary
				</h3>

				<div class="flex flex-wrap gap-4 py-4">
					<Card.Root class="min-w-32 flex-1">
						<Card.Header>
							<Card.Title>Total Sales</Card.Title>
							<Card.Description>Total sales for this year</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>Card Content</p>
						</Card.Content>
					</Card.Root>
					<Card.Root class="min-w-32 flex-1">
						<Card.Header>
							<Card.Title>Total Sales</Card.Title>
							<Card.Description>Total sales for this year</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>Card Content</p>
						</Card.Content>
					</Card.Root>
					<Card.Root class="min-w-32 flex-1">
						<Card.Header>
							<Card.Title>Total Sales</Card.Title>
							<Card.Description>Total sales for this year</Card.Description>
						</Card.Header>
						<Card.Content>
							<p>Card Content</p>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	</div>
</div>
