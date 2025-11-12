import { NextRequest, NextResponse } from 'next/server';
import { ApiEndpoints } from '../../../../lib/api/endpoints';
import {
  ApiClientError,
  backendApiClient,
} from '../../../../lib/api/http-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await backendApiClient.post(
      ApiEndpoints.backend.auth.login,
      body
    );
    const data = response.data;

    const res = NextResponse.json(data, { status: 200 });

    if (data.accessToken) {
      res.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      });
    }

    if (data.refreshToken) {
      res.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status ?? 500 }
      );
    }

    console.error('[API] Login error', error);
    return NextResponse.json(
      { message: "Impossible d'effectuer la connexion" },
      { status: 500 }
    );
  }
}
