import { db } from '$lib/server/db';
import { event, eventsToDrinks, type SelectEventsToDrinks } from '$lib/server/db/schema';
import { and, eq, gt, lt } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({}) => {
	const events = await db.select().from(event).orderBy(event.datetime);

	const salesThisYear = await getSales(getCurrentYear());
	const salesLastYear = await getSales(getCurrentYear() - 1);

	const attendanceThisYear = await getAttendance(getCurrentYear());
	const attendanceLastYear = await getAttendance(getCurrentYear() - 1);

	return {
		events: events,
		salesThisYear: salesThisYear,
		salesLastYear: salesLastYear,
		attendanceThisYear: attendanceThisYear,
		attendanceLastYear: attendanceLastYear
	};
};

function getCurrentYear(): number {
	const currentDate = new Date();
	if (currentDate.getMonth() < 8) {
		return currentDate.getFullYear() - 1;
	}
	return currentDate.getFullYear();
}

async function getSales(year: number): Promise<number> {
	const startDate = new Date(year, 8, 1);
	const endDate = new Date(year + 1, 7, 31);
	const events = await db
		.select({ id: event.id })
		.from(event)
		.where(and(gt(event.datetime, startDate), lt(event.datetime, endDate)));

	let sales = 0;
	for (let event of events) {
		const result = await db
			.select({ amountSold: eventsToDrinks.amountSold })
			.from(eventsToDrinks)
			.where(eq(eventsToDrinks.eventId, event.id));
		sales += result.reduce((acc, curr) => acc + curr.amountSold, 0);
	}
	return sales;
}

async function getAttendance(year: number): Promise<number> {
	const startDate = new Date(year, 8, 1);
	const endDate = new Date(year + 1, 7, 31);
	const events = await db
		.select({ numberOfParticipants: event.numberOfParticipants })
		.from(event)
		.where(and(gt(event.datetime, startDate), lt(event.datetime, endDate)));

	return events.reduce((acc, curr) => acc + curr.numberOfParticipants, 0);
}
