export const V2_ROUTES = {
  home: '/v2',
  observatory: '/v2/observatory',
  institutionalOs: '/v2/os',
  livingArchive: '/v2/archive',
  compare: '/v2/compare',
} as const

export type V2Route = (typeof V2_ROUTES)[keyof typeof V2_ROUTES]
