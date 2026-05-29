import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'paperclip',
  title: 'Paperclip',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/paperclip-startos',
  upstreamRepo: 'https://github.com/paperclipai/paperclip',
  marketingUrl: 'https://paperclip.ing/',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'startos'],
  images: {
    paperclip: {
      source: {
        dockerBuild: {
          workdir: './paperclip',
          dockerfile: './paperclip/Dockerfile',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
