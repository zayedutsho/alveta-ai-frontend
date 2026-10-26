import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'iwd3xpdu',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: '../src/lib/sanity.ts',
    schema: './schema.json',
    generates: '../src/lib/sanity.generated.ts',
  },
})
