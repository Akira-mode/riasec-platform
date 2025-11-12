export const ApiEndpoints = {
  web: {
    profile: '/profile',
    auth: {
      login: '/auth/login',
    },
  },
  backend: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      activate: (token: string) => `/auth/activate/${token}`,
    },
    users: {
      me: {
        profile: '/users/me/profile',
      },
    },
    assessments: {
      result: (assessmentId: string) => `/assessments/${assessmentId}/result`,
    },
  },
} as const;

