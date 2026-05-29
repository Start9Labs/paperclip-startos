import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {
      betterAuthSecret: utils.getDefaultString({
        charset: 'a-z,A-Z,0-9',
        len: 48,
      }),
    })
  } else {
    await storeJson.merge(effects, {})
  }
})
