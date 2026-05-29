import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const inputSpec = sdk.InputSpec.of({
  allowSignUps: sdk.Value.toggle({
    name: i18n('Allow New Sign-Ups'),
    description: i18n(
      'When enabled, anyone who can reach this instance can create an account. When disabled, only existing users can sign in.',
    ),
    default: true,
  }),
})

export const manageSignUps = sdk.Action.withInput(
  'manage-sign-ups',

  {
    name: i18n('Manage New User Sign-Ups'),
    description: i18n(
      'Allow or block new account registration. Disable sign-ups once you have created your account so no one else can register.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  inputSpec,

  async ({ effects }) => {
    const disabled = await storeJson.read((s) => s.disableSignUp).once()
    return { allowSignUps: !disabled }
  },

  async ({ effects, input }) => {
    await storeJson.merge(effects, { disableSignUp: !input.allowSignUps })
    await effects.restart()

    return {
      version: '1',
      title: i18n('Settings saved'),
      message: i18n('Paperclip is restarting to apply your sign-up setting.'),
      result: null,
    }
  },
)
