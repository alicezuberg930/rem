import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const PACKAGE_CHUNKS: Record<string, string> = {
  '@base-ui/react': 'ui-primitives',
  '@dnd-kit/core': 'drag-drop',
  '@dnd-kit/sortable': 'drag-drop',
  '@dnd-kit/utilities': 'drag-drop',
  '@hookform/resolvers': 'forms',
  '@tailwindcss/vite': 'build-tooling',
  '@tanstack/react-query': 'tanstack',
  '@tanstack/react-query-devtools': 'tanstack',
  '@tanstack/react-router': 'tanstack',
  '@tanstack/react-router-devtools': 'tanstack',
  '@tanstack/react-table': 'tanstack',
  'ag-grid-community': 'data-grid',
  'ag-grid-react': 'data-grid',
  'class-variance-authority': 'ui-utilities',
  clsx: 'ui-utilities',
  cmdk: 'ui-primitives',
  'date-fns': 'dates',
  'embla-carousel-react': 'ui-widgets',
  'framer-motion': 'motion',
  'input-otp': 'ui-widgets',
  juice: 'editor-html',
  'lucide-react': 'icons',
  react: 'react-core',
  'react-day-picker': 'dates',
  'react-dom': 'react-core',
  'react-dropzone': 'file-tools',
  'react-hook-form': 'forms',
  'react-top-loading-bar': 'ui-widgets',
  'read-excel-file': 'file-tools',
  recharts: 'charts',
  shadcn: 'build-tooling',
  sonner: 'ui-widgets',
  'tailwind-merge': 'ui-utilities',
  tailwindcss: 'build-tooling',
  'tw-animate-css': 'build-tooling',
  zod: 'forms',
}

const PACKAGE_FAMILY_CHUNKS: ReadonlyArray<readonly [string, string]> = [
  ['@dnd-kit/', 'drag-drop'],
  ['@floating-ui/', 'ui-primitives'],
  ['@reduxjs/', 'state'],
  ['@tanstack/', 'tanstack'],
  ['ag-grid-', 'data-grid'],
  ['d3-', 'charts'],
]

const getPackageName = (id: string) => {
  const normalizedId = id.replace(/\\/g, '/')
  const nodeModulesMarker = '/node_modules/'
  const nodeModulesIndex = normalizedId.lastIndexOf(nodeModulesMarker)
  if (nodeModulesIndex === -1) return undefined

  const packagePath = normalizedId.slice(nodeModulesIndex + nodeModulesMarker.length)
  const [scopeOrName, scopedName] = packagePath.split('/')
  if (!scopeOrName) return undefined

  return scopeOrName.startsWith('@') && scopedName ? `${scopeOrName}/${scopedName}` : scopeOrName
}

const isCKEditorPackage = (packageName: string) => packageName === 'ckeditor5' || packageName.startsWith('@ckeditor/')

const isCKEditorModule = (id: string) => {
  const packageName = getPackageName(id)
  return packageName ? isCKEditorPackage(packageName) : false
}

const getManualChunk = (id: string) => {
  const packageName = getPackageName(id)
  if (!packageName) return null
  if (isCKEditorPackage(packageName)) return null

  const configuredChunk = PACKAGE_CHUNKS[packageName]
  if (configuredChunk) return configuredChunk

  const familyChunk = PACKAGE_FAMILY_CHUNKS.find(([prefix]) => packageName.startsWith(prefix))
  return familyChunk?.[1] ?? 'vendor-misc'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        minifyInternalExports: true,
        codeSplitting: {
          groups: [
            {
              name: 'editor-ckeditor',
              test: isCKEditorModule,
              priority: 20,
            },
            {
              name: getManualChunk,
              test: (id) => /[\\/]node_modules[\\/]/.test(id) && !isCKEditorModule(id),
              priority: 10,
              maxSize: 500 * 1024,
              entriesAware: true,
              entriesAwareMergeThreshold: 20 * 1024,
            },
          ],
        },
        chunkFileNames: ({ name }) => `chunks/${name.split('~', 1)[0]}-[hash].js`,
        entryFileNames: 'entries/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 500,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
