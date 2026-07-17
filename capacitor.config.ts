import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'midori.wastebank',
  appName: 'midori',
  webDir: 'www',
  android: {
    allowMixedContent: false,
  },
}

export default config
