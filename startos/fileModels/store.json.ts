import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  betterAuthSecret: z.string(),
  anthropicApiKey: z.string().optional().catch(undefined),
  openaiApiKey: z.string().optional().catch(undefined),
  disableSignUp: z.boolean().catch(false).default(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: './store.json' },
  shape,
)
