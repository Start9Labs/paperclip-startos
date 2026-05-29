import { sdk } from './sdk'

export const uiPort = 3100
export const dataDir = '/paperclip'

export const mainMounts = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint: dataDir,
  readonly: false,
})
