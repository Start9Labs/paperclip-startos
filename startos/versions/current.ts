import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2026.525.0:0',
  releaseNotes: {
    en_US: 'Initial release of Paperclip for StartOS.',
    es_ES: 'Versión inicial de Paperclip para StartOS.',
    de_DE: 'Erste Veröffentlichung von Paperclip für StartOS.',
    pl_PL: 'Pierwsze wydanie Paperclip dla StartOS.',
    fr_FR: 'Version initiale de Paperclip pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
