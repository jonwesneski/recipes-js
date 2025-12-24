'use server';

import { cookies } from 'next/headers';

export async function deleteCookie() {
  (await cookies()).delete('access_token');
  (await cookies()).delete('temp_access_token');
}
