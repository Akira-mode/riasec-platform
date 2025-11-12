import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiEndpoints } from '../../../lib/api/endpoints';
import {
  ApiClientError,
  createBackendApiClient,
} from '../../../lib/api/http-client';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: 'Utilisateur non authentifié' },
      { status: 401 }
    );
  }

  const apiClient = createBackendApiClient(accessToken);

  try {
    const response = await apiClient.get(
      ApiEndpoints.backend.users.me.profile
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      const status = error.status ?? 500;
      const payload =
        error.data && typeof error.data === 'object'
          ? error.data
          : { message: error.message };
      return NextResponse.json(payload, { status });
    }

    console.error('[API] profile error', error);
    return NextResponse.json(
      { message: 'Impossible de charger le profil' },
      { status: 500 }
    );
  }
}
