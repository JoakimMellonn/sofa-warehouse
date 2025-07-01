import { z } from 'zod/v4';

export const addItemSchema = z.object({
	name: z.string().min(1),
	amount: z.number().min(0),
	unit: z.string().min(1),
	sizeML: z.number().min(0)
});
