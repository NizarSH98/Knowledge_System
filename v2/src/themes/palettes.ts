import type { GraphicsTheme, SemanticColorMap, ThemeDefinition, ThemeMode } from './tokens.ts'

function defineTheme(
  id: string,
  name: string,
  mode: ThemeMode,
  character: string,
  colors: SemanticColorMap,
  postprocessingCharacter: GraphicsTheme['postprocessingCharacter'],
): ThemeDefinition {
  return {
    id,
    name,
    mode,
    character,
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
  defineTheme('polar-sage', 'Polar Sage', 'light', 'Cool scientific calm', {
    background: '#EDF1EE', surface: '#E3E9E5', surfaceRaised: '#F8FAF7', text: '#101616', textMuted: '#53605C',
    primary: '#176E62', evidence: '#53661D', current: '#176E62', restricted: '#96394B', superseded: '#736B60',
    warning: '#8C591D', relationship: '#315BA8', border: '#B9C5BE', focus: '#254F91', hover: '#D8E2DC', selection: '#C8DED6',
  }, 'clean'),
  defineTheme('warm-paper', 'Warm Paper', 'light', 'Quiet editorial warmth', {
    background: '#F2EFE7', surface: '#E8E4DA', surfaceRaised: '#FCFAF5', text: '#1B1A17', textMuted: '#625D53',
    primary: '#315A8F', evidence: '#566B35', current: '#286957', restricted: '#93424A', superseded: '#746C60',
    warning: '#8D6027', relationship: '#526B91', border: '#CEC7BA', focus: '#315A8F', hover: '#E1DCD0', selection: '#D7E0EB',
  }, 'paper'),
  defineTheme('mineral-blue', 'Mineral Blue', 'light', 'Measured technical clarity', {
    background: '#ECF0F3', surface: '#E0E7EC', surfaceRaised: '#F8FAFB', text: '#11181D', textMuted: '#53616A',
    primary: '#315F7D', evidence: '#52652A', current: '#246B62', restricted: '#994555', superseded: '#6E7377',
    warning: '#8D5E2C', relationship: '#4A6591', border: '#BEC9D0', focus: '#315F7D', hover: '#D8E2E8', selection: '#CEDFE8',
  }, 'cool'),
  defineTheme('quiet-clay', 'Quiet Clay', 'light', 'Architectural and grounded', {
    background: '#F1ECE8', surface: '#E7DFD9', surfaceRaised: '#FBF8F5', text: '#1E1916', textMuted: '#665A53',
    primary: '#754536', evidence: '#50613A', current: '#356A5D', restricted: '#98404A', superseded: '#786C64',
    warning: '#8D5E2E', relationship: '#5C6685', border: '#CFC2B9', focus: '#684F78', hover: '#E0D6CF', selection: '#E6D1C8',
  }, 'material'),
  defineTheme('parchment-olive', 'Parchment Olive', 'light', 'Institutional naturalism', {
    background: '#EFEEE4', surface: '#E4E4D6', surfaceRaised: '#FAF9F1', text: '#1A1B16', textMuted: '#5D6054',
    primary: '#4E6743', evidence: '#75642A', current: '#346858', restricted: '#913E47', superseded: '#716E61',
    warning: '#865D27', relationship: '#526A83', border: '#C8C8B8', focus: '#3D5F75', hover: '#DCDCCD', selection: '#D4DEC9',
  }, 'paper'),
  defineTheme('mist-lilac', 'Mist Lilac', 'light', 'Soft analytical focus', {
    background: '#EFEEF2', surface: '#E4E3E9', surfaceRaised: '#FAF9FC', text: '#18171D', textMuted: '#5F5B68',
    primary: '#5A5079', evidence: '#526433', current: '#2D6C61', restricted: '#974451', superseded: '#716C76',
    warning: '#8C5D2D', relationship: '#4F6595', border: '#C7C4CE', focus: '#554A78', hover: '#DDDAE3', selection: '#DCD6E8',
  }, 'clean'),
  defineTheme('sandstone', 'Sandstone', 'light', 'Warm operational restraint', {
    background: '#F1ECE3', surface: '#E6DED2', surfaceRaised: '#FCF9F3', text: '#201A15', textMuted: '#685B50',
    primary: '#725133', evidence: '#506947', current: '#32695B', restricted: '#954149', superseded: '#746B61',
    warning: '#895921', relationship: '#596A84', border: '#CEC2B2', focus: '#49617F', hover: '#DED4C7', selection: '#E4D6C4',
  }, 'warm'),
  defineTheme('soft-cyan', 'Soft Cyan', 'light', 'Airy systems workspace', {
    background: '#EAF1F1', surface: '#DDE8E7', surfaceRaised: '#F7FBFA', text: '#111A1A', textMuted: '#506261',
    primary: '#24676C', evidence: '#566526', current: '#246A5B', restricted: '#964250', superseded: '#687473',
    warning: '#875C26', relationship: '#426B8A', border: '#B9CBC9', focus: '#315F83', hover: '#D3E2E0', selection: '#C7DFDC',
  }, 'cool'),

  defineTheme('night-instrument', 'Night Instrument', 'dark', 'Precision scientific device', {
    background: '#07090B', surface: '#0D1115', surfaceRaised: '#141A20', text: '#EEF3F1', textMuted: '#98A39F',
    primary: '#6FD7BD', evidence: '#D4E86A', current: '#6FD7BD', restricted: '#EC7C87', superseded: '#AA9780',
    warning: '#F0B45D', relationship: '#86A6FF', border: '#34403E', focus: '#F0B45D', hover: '#182126', selection: '#203832',
  }, 'clean'),
  defineTheme('deep-cobalt', 'Deep Cobalt', 'dark', 'Institutional computation', {
    background: '#080B13', surface: '#101625', surfaceRaised: '#172033', text: '#F2F4F7', textMuted: '#A5AEC0',
    primary: '#708CFF', evidence: '#E0CD75', current: '#67D7CA', restricted: '#E17B8C', superseded: '#A1A8B8',
    warning: '#EDAD70', relationship: '#64D4C8', border: '#36435D', focus: '#E0CD75', hover: '#1C2740', selection: '#283B69',
  }, 'cool'),
  defineTheme('graphite-spectral', 'Graphite Spectral', 'dark', 'Premium material neutrality', {
    background: '#111110', surface: '#191918', surfaceRaised: '#222220', text: '#F1EEE6', textMuted: '#AAA59A',
    primary: '#9ED2C5', evidence: '#D0C47E', current: '#9ED2C5', restricted: '#D98284', superseded: '#9C9182',
    warning: '#E0AA73', relationship: '#9AB1D4', border: '#403E38', focus: '#E0AA73', hover: '#2A2925', selection: '#344640',
  }, 'material'),
  defineTheme('forest-slate', 'Forest Slate', 'dark', 'Calm governed depth', {
    background: '#0E1714', surface: '#15211D', surfaceRaised: '#1D2B26', text: '#EDF3EF', textMuted: '#9DADA5',
    primary: '#7FC0A5', evidence: '#C5BD7D', current: '#7FC0A5', restricted: '#D77B7C', superseded: '#9A9687',
    warning: '#D7A56B', relationship: '#83ACC8', border: '#344A40', focus: '#D7BC7A', hover: '#24352F', selection: '#304B40',
  }, 'material'),
  defineTheme('aubergine-ink', 'Aubergine Ink', 'dark', 'Quiet cultural intelligence', {
    background: '#171218', surface: '#211922', surfaceRaised: '#2B222D', text: '#F3EDF2', textMuted: '#B0A2AE',
    primary: '#C79ABD', evidence: '#C0C580', current: '#8CC8AE', restricted: '#E0808A', superseded: '#A397A1',
    warning: '#DCA66C', relationship: '#99A9D3', border: '#493B49', focus: '#DBB47B', hover: '#312634', selection: '#4A3649',
  }, 'warm'),
  defineTheme('bronze-night', 'Bronze Night', 'dark', 'Warm archival instrument', {
    background: '#161411', surface: '#201D19', surfaceRaised: '#2A2620', text: '#F2EEE7', textMuted: '#ADA397',
    primary: '#C9A06F', evidence: '#B0BF84', current: '#8EC4A8', restricted: '#D9807F', superseded: '#9E9385',
    warning: '#DAB075', relationship: '#8CA8C2', border: '#463F35', focus: '#DAB075', hover: '#302B24', selection: '#4B3E2E',
  }, 'material'),
]

export function themesForMode(mode: ThemeMode): readonly ThemeDefinition[] {
  return themes.filter((theme) => theme.mode === mode)
}

export function themeById(themeId: string): ThemeDefinition | undefined {
  return themes.find((theme) => theme.id === themeId)
}

export function defaultThemeForMode(mode: ThemeMode): ThemeDefinition {
  const theme = themesForMode(mode)[0]
  if (!theme) throw new Error(`No ${mode} theme configured`)
  return theme
}

export const defaultTheme = defaultThemeForMode('light')
