import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './server/db';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import * as schema from './server/db/schema';
import { getRequestEvent } from '$app/server';
import { admin } from 'better-auth/plugins';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...schema
		}
	}),
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false
			}
		}
	},
	emailAndPassword: {
		enabled: true
	},
	plugins: [admin(), sveltekitCookies(getRequestEvent)]
});
