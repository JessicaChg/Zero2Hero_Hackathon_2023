import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "@walletconnect/client";
import { toUtf8Bytes } from "ethers/lib/utils";
import { getIdentity, createAuthActor } from '../../api/dfx'
import { parsePersonalSign } from './signature'
// import WalletConnect from "@walletconnect/browser";

const isProd = import.meta.env.MODE === 'production'

export const loginWithWalletConnect = async () => {
    // 创建一个 connector
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModal,
    });

    // 当connector链接时kill并新建会话
    if (connector.connected) {
        await connector.killSession();
    }
    connector.createSession();
    
    // 检查链接是否断开 - create new session
    // if (!connector.connected) {
    //     connector.createSession();
    // }

    return connector;
}

export const signPersonalMessage = (connector: WalletConnect, accounts: any[], message: string) => {
    const msgParams = [
        toUtf8Bytes(message),
        accounts[0],
    ];
    return connector.signPersonalMessage(msgParams)
}

export const walletConnectAuth = async (connector: WalletConnect, accounts: any[], showLoading?: Function) => {
    const message = `${new Date().getTime()}`;
    const signature = await signPersonalMessage(connector, accounts, message)
    const formatted = parsePersonalSign({
        message,
        signature,
    })
    if (showLoading) showLoading()
    const authAcotr = await createAuthActor({ local: !isProd })
    const identity = await getIdentity(authAcotr, {
        walletName: 'metamask',
        message: formatted.message,
        signature: formatted.signature,
        algorithm: 'secp256k1',
        publicKey: formatted.publicKey,
        chainName: 'eth',
    })
    return {
        signature,
        address: accounts[0],
        message,
        identity,
    }
}

export const entireWalletConnectAuth = async ({
    showLoading
}: {
    showLoading?: Function;
}) => {
    return new Promise(async (resolve) => {
        const connector = await loginWithWalletConnect()
        connector.on("connect", async (error, payload) => {
            if (error) { throw error; }
            const { accounts } = payload.params[0]
            const authRes = await walletConnectAuth(connector, accounts, showLoading)
            resolve(authRes)
        });
    })
}