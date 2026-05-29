import { setProviderKeys } from '../actions/setProviderKeys'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const bootstrap = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)
  if (!store?.anthropicApiKey && !store?.openaiApiKey) {
    await sdk.action.createOwnTask(effects, setProviderKeys, 'important', {
      reason: i18n(
        'Add an LLM provider API key (Anthropic or OpenAI) so your agents can run.',
      ),
    })
  }
})
