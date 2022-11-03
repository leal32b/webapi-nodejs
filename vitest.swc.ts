import { transform } from '@swc/core'
import { Plugin } from 'vite'

export function Swc (): Plugin {
  return {
    name: 'rollup-plugin-swc',
    async transform (code: string, id: string) {
      const result = await transform(code, {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            decorators: true
          },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true
          }
        },
        filename: id
      })

      return {
        code: result.code,
        map: result.map
      }
    }
  }
}
