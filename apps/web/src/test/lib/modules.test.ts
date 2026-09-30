import { describe, expect, it } from 'vitest'

const libraryModules = import.meta.glob('../../lib/**/*.{ts,tsx}')

describe('library modules', () => {
  for (const [modulePath, loadModule] of Object.entries(libraryModules)) {
    it(`loads ${modulePath.replace('../../lib/', '')}`, async () => {
      await expect(loadModule()).resolves.toBeTypeOf('object')
    })
  }
})
