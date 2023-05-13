import { ethers } from "ethers"
import { getIdentity, createAuthActor } from '../../api/dfx'
import { parsePersonalSign } from './signature'

const isProd = import.meta.env.MODE === 'production'

const checkMetamaskExist = () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!')
        return
    }
    throw new Error('Metamask is not installed!')
}

export const metamaskAuth = async ({
    showLoading
}: {
    showLoading?: Function;
}) => {
    checkMetamaskExist()
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    if (!accounts || !accounts[0]) throw new Error('There is no account')
    const signer = provider.getSigner()
    if (!signer) throw new Error('getSigner error')
    const message = `${new Date().getTime()}`
    const signature = await signer.signMessage(message)
    const formatted = parsePersonalSign({
        message,
        signature,
    })
    if (showLoading) showLoading()
    const authAcotr = await createAuthActor({ local: !isProd })
    console.log('%c [ authAcotr ]-34', 'font-size:13px; background:pink; color:#bf2c9f;', authAcotr)
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