import type { DirectionId } from '../directions/registry.ts'
import type {
  GraphicsTheme,
  SemanticColorMap,
  ThemeDefinition,
} from './tokens.ts'

function defineTheme(
  id: string,
  name: string,
  directionId: DirectionId,
  colors: SemanticColorMap,
  postprocessingCharacter: GraphicsTheme['postprocessingCharacter'],
): ThemeDefinition {
  return {
    id,
    name,
    directionId,
    colors,
    graphics: {
      background: colors.background,
      surface: colors.surface,
      knowledge: colors.primary,
      relationship: colors.relationship,
      evidence: colors.evidence,
      restricted: colors.restricted,
      superseded: colors.superseded,
      selection: colors.selection,
      postprocessingCharacter,
    },
  }
}

export const themes: readonly ThemeDefinition[] = [
  defineTheme('night-instrument', 'Night Instrument', 'observatory', {
    background: '#07090B', surface: '#0D1115', surfaceRaised: '#141A20', text: '#EEF3F1', textMuted: '#84908B',
    primary: '#6FD7BD', evidence: '#D4E86A', current: '#6FD7BD', restricted: '#EC6A76', superseded: '#9B8770',
    warning: '#F0B45D', relationship: '#789DFF', border: '#27302F', focus: '#F0B45D', hover: '#182126', selection: '#203832',
  }, 'clean'),
  defineTheme('deep-cobalt', 'Deep Cobalt', 'observatory', {
    background: '#080B13', surface: '#101625', surfaceRaised: '#172033', text: '#F2F4F7', textMuted: '#8D96A8',
    primary: '#5B7CFA', evidence: '#DFCA69', current: '#56D0C2', restricted: '#DA6579', superseded: '#8E94A5',
    warning: '#E79C61', relationship: '#56D0C2', border: '#2B354A', focus: '#DFCA69', hover: '#1C2740', selection: '#24345F',
  }, 'cool'),
  defineTheme('polar-instrument', 'Polar Instrument', 'observatory', {
    background: '#EDF1EE', surface: '#E4E9E5', surfaceRaised: '#F7F8F5', text: '#101616', textMuted: '#677370',
    primary: '#167B6C', evidence: '#798C27', current: '#167B6C', restricted: '#AA3F52', superseded: '#8E8678',
    warning: '#A96B21', relationship: '#315BB5', border: '#C7D0CA', focus: '#315BB5', hover: '#DCE5E0', selection: '#CBE1DA',
  }, 'clean'),
  defineTheme('graphite-spectral', 'Graphite Spectral', 'observatory', {
    background: '#111110', surface: '#191918', surfaceRaised: '#21211F', text: '#F1EEE6', textMuted: '#8E8A80',
    primary: '#91C9BC', evidence: '#C7BA72', current: '#91C9BC', restricted: '#C56E70', superseded: '#877D70',
    warning: '#D79A61', relationship: '#8AA2C8', border: '#35342F', focus: '#D79A61', hover: '#292824', selection: '#31413D',
  }, 'material'),

  defineTheme('black-cobalt', 'Black / Cobalt', 'institutional-os', {
    background: '#0C0D0F', surface: '#121418', surfaceRaised: '#1A1D22', text: '#F4F4F1', textMuted: '#8A9098',
    primary: '#5174E8', evidence: '#A9C77A', current: '#5FB89F', restricted: '#D66372', superseded: '#777E88',
    warning: '#D49A54', relationship: '#7189D6', border: '#343940', focus: '#7F9AFF', hover: '#20242A', selection: '#25345F',
  }, 'clean'),
  defineTheme('warm-white-ink', 'Warm White / Ink', 'institutional-os', {
    background: '#F3F1EA', surface: '#ECE9E0', surfaceRaised: '#FAF9F5', text: '#171918', textMuted: '#6F736F',
    primary: '#244F9E', evidence: '#617C33', current: '#257D68', restricted: '#9E4050', superseded: '#8A857A',
    warning: '#9D682A', relationship: '#5574A8', border: '#D1CEC4', focus: '#244F9E', hover: '#E2DED3', selection: '#DCE4F2',
  }, 'warm'),
  defineTheme('steel-teal', 'Steel / Teal', 'institutional-os', {
    background: '#101518', surface: '#172024', surfaceRaised: '#202B30', text: '#EFF4F2', textMuted: '#8E9C99',
    primary: '#4AAEAB', evidence: '#C0CA6D', current: '#72C7A3', restricted: '#D46C75', superseded: '#7F8D8B',
    warning: '#DCA25B', relationship: '#6F9EAA', border: '#304045', focus: '#C0CA6D', hover: '#253339', selection: '#274B4A',
  }, 'cool'),
  defineTheme('oxide-paper', 'Oxide / Paper', 'institutional-os', {
    background: '#EDEAE4', surface: '#E4E0D8', surfaceRaised: '#F8F6F1', text: '#211D1A', textMuted: '#736B64',
    primary: '#7C3E30', evidence: '#68753B', current: '#397668', restricted: '#A44249', superseded: '#8E8175',
    warning: '#A26A2F', relationship: '#85645A', border: '#CCC5BB', focus: '#7C3E30', hover: '#DDD7CD', selection: '#E4CCC4',
  }, 'material'),

  defineTheme('ivory-oxblood', 'Ivory / Oxblood', 'living-archive', {
    background: '#EEEAE0', surface: '#F8F5EC', surfaceRaised: '#FFFFFF', text: '#201C19', textMuted: '#736C63',
    primary: '#783A38', evidence: '#536B50', current: '#536B50', restricted: '#8A3038', superseded: '#948777',
    warning: '#9C7A48', relationship: '#345A88', border: '#D7D0C3', focus: '#345A88', hover: '#E8E1D4', selection: '#E7D5CE',
  }, 'paper'),
  defineTheme('charcoal-brass', 'Charcoal / Brass', 'living-archive', {
    background: '#11110F', surface: '#1A1916', surfaceRaised: '#23211D', text: '#F0EBE0', textMuted: '#999184',
    primary: '#C09A5D', evidence: '#9DB082', current: '#9DB082', restricted: '#C46A67', superseded: '#82796E',
    warning: '#D0AD6A', relationship: '#7894B3', border: '#39352E', focus: '#D0AD6A', hover: '#292720', selection: '#453A28',
  }, 'material'),
  defineTheme('bone-cobalt', 'Bone / Cobalt', 'living-archive', {
    background: '#F0EEE8', surface: '#FAF9F5', surfaceRaised: '#FFFFFF', text: '#151719', textMuted: '#707276',
    primary: '#315A9E', evidence: '#627443', current: '#627443', restricted: '#A4434D', superseded: '#8B8278',
    warning: '#A66C35', relationship: '#315A9E', border: '#D6D1C8', focus: '#315A9E', hover: '#E7E3DB', selection: '#DCE4F1',
  }, 'paper'),
  defineTheme('forest-parchment', 'Forest / Parchment', 'living-archive', {
    background: '#10201B', surface: '#172A23', surfaceRaised: '#20372E', text: '#F1EFE5', textMuted: '#96A39B',
    primary: '#B7A06C', evidence: '#91B383', current: '#91B383', restricted: '#C16C6B', superseded: '#817F72',
    warning: '#D4BE82', relationship: '#7D9FC0', border: '#385046', focus: '#D4BE82', hover: '#294239', selection: '#3E4934',
  }, 'material'),
]

export function themesForDirection(directionId: DirectionId): readonly ThemeDefinition[] {
  return themes.filter((theme) => theme.directionId === directionId)
}

export function themeById(themeId: string): ThemeDefinition | undefined {
  return themes.find((theme) => theme.id === themeId)
}

export function defaultThemeFor(directionId: DirectionId): ThemeDefinition {
  const theme = themesForDirection(directionId)[0]
  if (!theme) throw new Error(`No theme configured for ${directionId}`)
  return theme
}
