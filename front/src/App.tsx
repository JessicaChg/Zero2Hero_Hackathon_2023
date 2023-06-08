import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { Route } from './route'
import { WagmiConfig } from 'wagmi'
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiConfig } from './config/wallet.ts'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
})

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={darkTheme()}>
          <Route />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  )
}

export default App
