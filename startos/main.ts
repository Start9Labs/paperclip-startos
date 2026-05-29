import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { dataDir, mainMounts, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Paperclip!'))

  const store = await storeJson.read().const(effects)
  if (!store?.betterAuthSecret) {
    throw new Error('store.json betterAuthSecret not found')
  }

  // Every hostname StartOS assigns this interface must be trusted by
  // Paperclip's private-hostname guard and Better Auth, or requests are
  // rejected with a 403. Feeding them all in lets the .onion, .local and
  // LAN-IP addresses work without hardcoding a single public URL.
  const hostnames = await sdk.serviceInterface
    .getOwn(
      effects,
      'ui',
      (u) =>
        u?.addressInfo
          ?.filter({ exclude: { kind: ['link-local', 'bridge'] } })
          .format('hostname-info')
          .map((h) => h.hostname.toLowerCase()) || [],
    )
    .const()

  const appSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'paperclip' },
    mainMounts,
    'paperclip-sub',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: appSub,
      exec: {
        command: ['chown', '-R', 'node:node', dataDir],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer: appSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          HOST: '0.0.0.0',
          PORT: String(uiPort),
          SERVE_UI: 'true',
          PAPERCLIP_HOME: dataDir,
          PAPERCLIP_DEPLOYMENT_MODE: 'authenticated',
          PAPERCLIP_DEPLOYMENT_EXPOSURE: 'private',
          PAPERCLIP_ALLOWED_HOSTNAMES: hostnames.join(','),
          BETTER_AUTH_SECRET: store.betterAuthSecret,
          PAPERCLIP_AUTH_DISABLE_SIGN_UP: store.disableSignUp
            ? 'true'
            : 'false',
          ...(store.anthropicApiKey
            ? { ANTHROPIC_API_KEY: store.anthropicApiKey }
            : {}),
          ...(store.openaiApiKey ? { OPENAI_API_KEY: store.openaiApiKey } : {}),
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 120000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(
            effects,
            `http://localhost:${uiPort}/api/health`,
            {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            },
          ),
      },
      requires: ['chown'],
    })
})
