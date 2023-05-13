import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import inject from '@rollup/plugin-inject'
import nodePolyfills from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/soul/',

  build: {
    target: ['es2020'],
    rollupOptions: {
      plugins: [nodePolyfills()]
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      exclude: ['node_modules/lodash-es/**', 'node_modules/@types/lodash-es/**']
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        'pinia',
        {
          '@/utils/utils': [
            // named imports
            'cutString',
            'logErr', // import { logErr } from '@/utils/utils',
            'getProvider',
            'getUserWorldCupAddr',
            'saveUserWorldCupAddr',
            'handleMintErr'
          ],
          '@/utils/providers': [
            'getChainRpcProvider',
            'getSbtCreator',
            'getSbtName',
            'checkIsUserMinted',
            'checkIsUseInWhiteList',
            'getContractInstance',
            'getRpcContract'
          ]
        }
      ],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // svg
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    })
  ],
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      '@': resolve(__dirname, './src'),
      '@img': resolve(__dirname, './src/assets/img')
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: { 'process.env': {} },

  server: {
    host: true,
    port: 3203,
    proxy: {
      '/dev-api': {
        target: 'https://d18xt9oh5g1o8h.cloudfront.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
})
