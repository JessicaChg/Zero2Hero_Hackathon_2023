/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SCAN_URL_POLYGON: string
  readonly VITE_SCAN_URL_MUMBAI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
