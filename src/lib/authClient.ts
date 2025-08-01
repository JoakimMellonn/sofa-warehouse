import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';
import type { auth } from './auth';

export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), adminClient()]
});
