import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {DocumentIcon} from '@sanity/icons/Document'

export default defineConfig({
  name: 'default',
  title: 'alveta',

  projectId: 'iwd3xpdu',
  dataset: 'production',

  plugins: [structureTool({
    structure: S => S.list().title('Alveta Marketing').items([
      S.listItem().title('Landing Page').icon(DocumentIcon).child(
        S.document().schemaType('landingPage').documentId('Oh6YgvMTqh9o5H57ty0iDS'),
      ),
    ]),
  }), visionTool()],
  document: {
    newDocumentOptions: previous => previous.filter(item => item.templateId !== 'landingPage'),
    actions: (previous, context) => context.schemaType === 'landingPage'
      ? previous.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action || '')) : previous,
  },

  schema: {
    types: schemaTypes,
  },
})
