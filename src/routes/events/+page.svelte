<div class="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden">
	<div class="layout-container flex h-full grow flex-col">
		<div class="flex flex-1 justify-center px-40 py-5">
			<div class="layout-content-container flex max-w-[960px] flex-1 flex-col">
				<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Events</h1>
				<p class="text-muted-foreground mt-3 text-sm">See coming and past events</p>

				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Coming events</h3>
				<div class="mt-3 flex overflow-hidden rounded-lg border">
					<table class="flex-1">
						<thead>
							<tr class="">
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
							<tr class="border-t">
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									<a href="/events/some-id"> Summer Bash </a>
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									July 15, 2024
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									City Park
								</td>
								<td class="h-[72px] w-60 px-4 py-2 text-sm leading-normal font-normal">
									<button
										class="bg-primary flex h-8 w-full max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 text-sm leading-normal font-medium"
									>
										<span class="text-primary-foreground truncate">Scheduled</span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Past events</h3>
				<div class="mt-3 flex overflow-hidden rounded-lg border">
					<table class="flex-1">
						<thead>
							<tr class="">
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
							<tr class="border-t">
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									<a href="/events/some-id"> Summer Bash </a>
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									July 15, 2024
								</td>
								<td class="h-[72px] w-[400px] px-4 py-2 text-sm leading-normal font-normal">
									City Park
								</td>
								<td class="h-[72px] w-60 px-4 py-2 text-sm leading-normal font-normal">
									<button
										class="bg-primary flex h-8 w-full max-w-[480px] min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 text-sm leading-normal font-medium"
									>
										<span class="text-primary-foreground truncate">Scheduled</span>
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
