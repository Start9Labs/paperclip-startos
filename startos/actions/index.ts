import { sdk } from '../sdk'
import { setProviderKeys } from './setProviderKeys'
import { manageSignUps } from './manageSignUps'

export const actions = sdk.Actions.of()
  .addAction(setProviderKeys)
  .addAction(manageSignUps)
