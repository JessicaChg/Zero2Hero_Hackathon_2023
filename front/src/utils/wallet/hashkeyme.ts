import QRCodeModal from '@walletconnect/qrcode-modal'
import WalletConnect from '@walletconnect/client'
import { toUtf8Bytes } from 'ethers/lib/utils'
import { getIdentity, createAuthActor } from '../../api/dfx'
import { parsePersonalSign } from './signature'
// import WalletConnect from "@walletconnect/browser";

const isProd = import.meta.env.MODE === 'production'


export const updateModal = () => {
  const modal = document.querySelector('#walletconnect-qrcode-modal')
  const header = document.querySelector('.walletconnect-modal__header')
  const qrcodeText = document.querySelector('#walletconnect-qrcode-text')
  const closeDom = document.querySelector('.walletconnect-modal__close__wrapper')

  if (modal) modal.classList.add('hashkeyme-login-modal')

  if (!qrcodeText || !header || !closeDom) {
      setTimeout(updateModal, 30)
      return
  }
  const hashkeymeTitle = document.createElement("div")
  hashkeymeTitle.classList.add('hashkeyme-login-title')
  hashkeymeTitle.innerHTML = 'HashKey Me'
  header.prepend(hashkeymeTitle)
  const hashkeymeLogo = document.createElement("div")
  hashkeymeLogo.innerHTML = `
      <svg class="walletconnect-modal__headerLogo" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z" fill="white" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3672 12C17.797 12 19.1183 12.4497 20.2037 13.2159C21.9121 14.4222 23.0248 16.4108 23.0248 18.6594C23.0248 20.5026 22.2797 22.1707 21.0697 23.3766L22.5071 33.1583C22.8045 35.1815 24.5402 36.6808 26.5851 36.6808H30.4367C30.5632 36.6808 30.6657 36.5783 30.6657 36.4518C30.6657 36.4407 30.6649 36.4295 30.6633 36.4185L28.7445 23.3766C29.9526 22.1707 30.7019 20.5026 30.7019 18.6594C30.7019 14.9814 27.7223 12 24.042 12H16.3672Z" fill="url(#paint0_linear_452_1318)" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M33.3365 18.6594C33.3365 20.5026 32.5872 22.1707 31.3793 23.3766L33.1478 34.4428C33.3538 35.7322 34.4661 36.6808 35.7718 36.6808H37.7708C37.8973 36.6808 37.9998 36.5783 37.9998 36.4518C37.9998 36.44 37.9989 36.4283 37.9971 36.4166L35.9676 23.3766C37.1627 22.1836 37.9089 20.5385 37.9247 18.7185V18.6006C37.8931 14.9496 34.9241 12 31.2653 12C30.4588 12 29.688 12.1436 28.9727 12.4053C31.5211 13.3405 33.3365 15.7877 33.3365 18.6594Z" fill="url(#paint1_linear_452_1318)" />
          <path style="mix-blend-mode:multiply" fill-rule="evenodd" clip-rule="evenodd" d="M16.367 12.0002L16.3643 12.0071C12.8237 12.1621 10 15.0801 10 18.6595C10 20.5026 10.7495 22.171 11.9592 23.3766H11.9574L10.0386 36.4185C10.0202 36.5436 10.1067 36.66 10.2318 36.6784C10.2428 36.68 10.254 36.6808 10.2651 36.6808H14.1175C16.1622 36.6808 17.8978 35.1819 18.1954 33.1589L19.6345 23.3766C18.4249 22.171 17.6773 20.5026 17.6773 18.6595C17.6773 16.7272 18.5019 14.9879 19.8165 13.7715L19.896 13.7002L19.9876 13.6205L20.0904 13.5339C20.1807 13.4592 20.2819 13.3787 20.3921 13.2963L20.5286 13.1967C20.8564 12.9632 21.2482 12.7262 21.6599 12.5686C21.7201 12.5455 21.7817 12.5233 21.8444 12.5018L21.971 12.46L22.0997 12.4203L22.2301 12.3826L22.3614 12.347L22.4931 12.3134L22.6245 12.2817L22.7551 12.252L22.9481 12.2109L23.1358 12.1739L23.3162 12.1409L23.4313 12.1211L23.6468 12.0865L23.8384 12.0584L24.2027 12.0121L24.2756 12.0044L16.367 12.0002Z" fill="url(#paint2_linear_452_1318)" />
          <defs>
          <linearGradient id="paint0_linear_452_1318" x1="23.5345" y1="12" x2="23.5345" y2="36.6808" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F8B05E" />
              <stop offset="1" stop-color="#F19159" />
          </linearGradient>
          <linearGradient id="paint1_linear_452_1318" x1="33.4862" y1="12" x2="33.4862" y2="36.6808" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F8B05E" />
              <stop offset="1" stop-color="#F19159" />
          </linearGradient>
          <linearGradient id="paint2_linear_452_1318" x1="17.1378" y1="12.0002" x2="17.1378" y2="36.6808" gradientUnits="userSpaceOnUse">
              <stop stop-color="#F29300" />
              <stop offset="1" stop-color="#EB6601" />
          </linearGradient>
          </defs>
      </svg>
  `
  hashkeymeLogo.style.display = 'inline-flex'
  header.prepend(hashkeymeLogo)

  const customQrcodeText = document.createElement("p")
  customQrcodeText.textContent = 'Scan QR code with HashKey Me wallet'
  customQrcodeText.classList.add('walletconnect-qrcode__text')
  qrcodeText.parentElement?.prepend(customQrcodeText)
}

export const loginWithWalletConnect = async () => {
  // 创建一个 connector
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    qrcodeModal: QRCodeModal
  })

  // 当connector链接时kill并新建会话
  if (connector.connected) {
    await connector.killSession()
  }
  await connector.createSession()

  // 覆盖弹窗样式
  updateModal()
  // 检查链接是否断开 - create new session
  // if (!connector.connected) {
  //     connector.createSession();
  // }

  return connector
}

export const signPersonalMessage = (
  connector: WalletConnect,
  accounts: any[],
  message: string
) => {
  const msgParams = [toUtf8Bytes(message), accounts[0]]
  return connector.signPersonalMessage(msgParams)
}

export const walletConnectAuth = async (
  connector: WalletConnect,
  accounts: any[],
  showLoading?: Function
) => {
  const message = `${new Date().getTime()}`
  const signature = await signPersonalMessage(connector, accounts, message)
  const formatted = parsePersonalSign({
    message,
    signature
  })
  if (showLoading) showLoading()
  const authAcotr = await createAuthActor({ local: !isProd })
  const identity = await getIdentity(authAcotr, {
    walletName: 'metamask',
    message: formatted.message,
    signature: formatted.signature,
    algorithm: 'secp256k1',
    publicKey: formatted.publicKey,
    chainName: 'eth'
  })
  return {
    signature,
    address: accounts[0],
    message,
    identity
  }
}

export const hashkeymeAuth = async ({
  showLoading
}: {
  showLoading?: Function
}) => {
  return new Promise(async (resolve) => {
    const connector = await loginWithWalletConnect()
    connector.on('connect', async (error, payload) => {
      if (error) {
        throw error
      }
      const { accounts } = payload.params[0]
      const authRes = await walletConnectAuth(connector, accounts, showLoading)
      resolve(authRes)
    })
  })
}