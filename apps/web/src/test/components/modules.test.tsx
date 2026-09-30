import { describe, expect, it } from 'vitest'

const componentModules = import.meta.glob('../../components/**/*.{ts,tsx}')

describe('component modules', () => {
  for (const [modulePath, loadModule] of Object.entries(componentModules)) {
    it(`loads ${modulePath.replace('../../components/', '')}`, async () => {
      await expect(loadModule()).resolves.toBeTypeOf('object')
    })
  }
})
