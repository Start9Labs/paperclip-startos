export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Paperclip!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The Paperclip web interface': 5,

  // actions/setProviderKeys.ts
  'Set Provider API Keys': 6,
  'Provide LLM provider API keys so your agents can run. Keys are stored encrypted on your server and injected into Paperclip at runtime.': 7,
  'Anthropic API Key': 8,
  'Used by the Claude Code agent adapter. Leave blank if you do not use it. Get a key at https://console.anthropic.com.': 9,
  'OpenAI API Key': 10,
  'Used by the Codex agent adapter. Leave blank if you do not use it. Get a key at https://platform.openai.com.': 11,
  'API keys saved': 12,
  'Paperclip is restarting to apply your new provider API keys.': 13,

  // actions/manageSignUps.ts
  'Manage New User Sign-Ups': 14,
  'Allow or block new account registration. Disable sign-ups once you have created your account so no one else can register.': 15,
  'Allow New Sign-Ups': 16,
  'When enabled, anyone who can reach this instance can create an account. When disabled, only existing users can sign in.': 17,
  'Settings saved': 18,
  'Paperclip is restarting to apply your sign-up setting.': 19,

  // init/bootstrap.ts
  'Add an LLM provider API key (Anthropic or OpenAI) so your agents can run.': 20,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
