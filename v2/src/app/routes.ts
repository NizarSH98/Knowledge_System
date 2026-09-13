export const V2_ROUTES = {
  home: '/',
  observatory: '/observatory',
  institutionalOs: '/os',
  livingArchive: '/archive',
  compare: '/compare',
} as const

export type V2Route = (typeof V2_ROUTES)[keyof typeof V2_ROUTES]
