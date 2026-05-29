import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  anthropicApiKey: Value.text({
    name: i18n('Anthropic API Key'),
    description: i18n(
      'Used by the Claude Code agent adapter. Leave blank if you do not use it. Get a key at https://console.anthropic.com.',
    ),
    required: false,
    default: null,
    masked: true,
  }),
  openaiApiKey: Value.text({
    name: i18n('OpenAI API Key'),
    description: i18n(
      'Used by the Codex agent adapter. Leave blank if you do not use it. Get a key at https://platform.openai.com.',
    ),
    required: false,
    default: null,
    masked: true,
  }),
})

export const setProviderKeys = sdk.Action.withInput(
  'set-provider-keys',

  {
    name: i18n('Set Provider API Keys'),
    description: i18n(
      'Provide LLM provider API keys so your agents can run. Keys are stored encrypted on your server and injected into Paperclip at runtime.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  inputSpec,

  async ({ effects }) => {
    const store = await storeJson.read().once()
    return {
      anthropicApiKey: store?.anthropicApiKey ?? null,
      openaiApiKey: store?.openaiApiKey ?? null,
    }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      anthropicApiKey: input.anthropicApiKey || undefined,
      openaiApiKey: input.openaiApiKey || undefined,
    })

    await sdk.action.clearTask(effects, 'paperclip:set-provider-keys')
    await effects.restart()

    return {
      version: '1',
      title: i18n('API keys saved'),
      message: i18n(
        'Paperclip is restarting to apply your new provider API keys.',
      ),
      result: null,
    }
  },
)
