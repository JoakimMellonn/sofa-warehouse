import { z } from 'zod/v4';

export const addItemSchema = z.object({
	name: z.string().min(1, 'You actually have to write something.'),
	amount: z.number().min(0, "No, it can't be less than zero..."),
	unit: z.string().min(1, 'You actually have to write something.'),
	sizeML: z.number().min(1, 'Are you sure this is the actual size?')
});
